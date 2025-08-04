import { bookmarkPost } from './bookmark.controller';
import { Request, Response } from "express";
import uploadToCloud from "../helpers/cloud.helper";
import postModel from "../models/post.model";
import expressAsyncHandler from 'express-async-handler';
import { AppError } from "../helpers/error.helper";
import CommentModel from "../models/comment.model";
import likeModel from "../models/like.model";
import UserModel from "../models/user.model";
import imageModel from "../models/image.model";
import BookmarkModel from '../models/bookmark.model';

export const getAllPosts = expressAsyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Get all private user IDs
    const privateUserIds = await UserModel.find({ account_type: 'private' }).distinct('_id');

    // Fetch posts excluding private users
    const posts = await postModel
        .find({
            user_id: { $nin: privateUserIds },
            type: "posted",
            post_type: "post"
        })
        .populate([
            { path: "images", select: "image_url -_id" },
            { path: "user_id", select: "name username _id account_type profile_pic" }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const postIds = posts.map(post => post._id);

    const [likeCounts, commentCounts, total] = await Promise.all([
        likeModel.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        CommentModel.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        postModel.countDocuments({
            user_id: { $nin: privateUserIds },
            type: "posted"
        })
    ]);

    const likeMap = new Map(likeCounts.map(i => [i._id.toString(), i.count]));
    const commentMap = new Map(commentCounts.map(i => [i._id.toString(), i.count]));

    const enrichedPosts = posts.map(post => ({
        ...post,
        like_count: likeMap.get(post._id.toString()) || 0,
        comment_count: commentMap.get(post._id.toString()) || 0
    }));

    res.json({
        status: true,
        message: "Posts fetched successfully",
        data: enrichedPosts,
        pagination: {
            total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
            has_next: skip + posts.length < total
        }
    });
});

export const getPost = expressAsyncHandler(async (req: Request, res: Response) => {
    const { post_id } = req.params;

    // Get all private user IDs
    const privateUserIds = await UserModel.find({ account_type: 'private' }).distinct('_id');

    const post = await postModel
        .findOne({
            _id: post_id,
            type: "posted",
            post_type: "post",
            user_id: { $nin: privateUserIds }
        })
        .populate([
            { path: "images", select: "image_url" },
            { path: "user_id", select: "name username _id account_type" }
        ])
        .lean();

    if (!post) throw new AppError("Post Not Found", 404);

    const [comment_count, like_count] = await Promise.all([
        CommentModel.countDocuments({ post_id }),
        likeModel.countDocuments({ post_id })
    ]);

    res.json({
        status: true,
        message: "Post Found",
        data: {
            ...post,
            comment_count,
            like_count
        }
    });
});

export const getMyPosts = expressAsyncHandler(async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const user_id = req.user._id;

    // Step 1: Fetch paginated posts
    const posts = await postModel.find({ user_id })
        .sort({ createdAt: -1 })
        .populate([
            { path: "images", select: "image_url -_id" },
            { path: "user_id", select: "name username _id account_type profile_pic" }
        ])
        .skip(skip)
        .limit(limit)
        .lean();

    const postIds = posts.map(post => post._id);

    // Step 2: Fetch like & comment counts
    const [likeCounts, commentCounts, likedPosts, bookmarkedPosts] = await Promise.all([
        likeModel.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        CommentModel.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        likeModel.find({ user_id, post_id: { $in: postIds } }).select("post_id").lean(),
        BookmarkModel.find({ user_id, post_id: { $in: postIds } }).select("post_id").lean()
    ]);

    // Step 3: Create maps for counts and liked IDs
    const likeMap = new Map(likeCounts.map(i => [i._id.toString(), i.count]));
    const commentMap = new Map(commentCounts.map(i => [i._id.toString(), i.count]));
    const likedPostIdSet = new Set(likedPosts.map(like => like.post_id.toString()));
    const bookmarkedPostIdSet = new Set(bookmarkedPosts.map(bookmark => bookmark.post_id.toString()));

    // Step 4: Enrich posts with counts and liked status
    const enrichedPosts = posts.map(post => ({
        ...post,
        like_count: likeMap.get(post._id.toString()) || 0,
        comment_count: commentMap.get(post._id.toString()) || 0,
        liked: likedPostIdSet.has(post._id.toString()),
        bookmarked: bookmarkedPostIdSet.has(post._id.toString())
    }));

    res.json({
        status: true,
        message: "Posts fetched successfully",
        data: enrichedPosts
    });
});


export const getUserPost = expressAsyncHandler(async (req: any, res: Response) => {
    const { user_id } = req.params;
    const user = await UserModel.find({ _id: user_id, account_type: "public", verified: true });
    const viewer_id = req.user._id;
    if (!user) throw new AppError("No Posts for User Found", 404);
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    // Step 1: Fetch paginated posts
    const posts = await postModel.find({ user_id, type: "posted" })
        .sort({ createdAt: -1 })
        .populate([
            { path: "images", select: "image_url -_id" },
            { path: "user_id", select: "name username _id account_type profile_pic" }
        ])
        .skip(skip)
        .limit(limit)
        .lean();

    const postIds = posts.map(post => post._id);

    // Step 2: Fetch like & comment counts
    const [likeCounts, commentCounts, likedPosts, bookmarkedPosts] = await Promise.all([
        likeModel.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        CommentModel.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        likeModel.find({ user_id: viewer_id, post_id: { $in: postIds } }).select("post_id").lean(),
        BookmarkModel.find({ user_id: viewer_id, post_id: { $in: postIds } }).select("post_id").lean()
    ]);

    // Step 3: Create maps for counts and liked IDs
    const likeMap = new Map(likeCounts.map(i => [i._id.toString(), i.count]));
    const commentMap = new Map(commentCounts.map(i => [i._id.toString(), i.count]));
    const likedPostIdSet = new Set(likedPosts.map(like => like.post_id.toString()));
    const bookmarkedPostIdSet = new Set(bookmarkedPosts.map(bookmark => bookmark.post_id.toString()));

    // Step 4: Enrich posts with counts and liked status
    const enrichedPosts = posts.map(post => ({
        ...post,
        like_count: likeMap.get(post._id.toString()) || 0,
        comment_count: commentMap.get(post._id.toString()) || 0,
        liked: likedPostIdSet.has(post._id.toString()),
        bookmarked: bookmarkedPostIdSet.has(post._id.toString())
    }));
    console.log(enrichedPosts);
    res.json({
        status: true,
        message: "Posts fetched successfully",
        data: enrichedPosts
    });
});

export const deleteImage = expressAsyncHandler(async (req: any, res: Response) => {
    const { image_id } = req.params;
    const user_id = req.user?._id;

    // Validate input
    if (!image_id || !user_id) {
        throw new AppError("Invalid Request", 400);
    }

    // Find image belonging to the user
    const existingImage = await imageModel.findOne({ _id: image_id, user_id });
    if (!existingImage) {
        throw new AppError("Image Not Found", 404);
    }

    // Fetch the associated post
    const post = await postModel.findById(existingImage.post_id);
    if (!post) {
        throw new AppError("Associated Post Not Found", 404);
    }

    // Ensure at least one image remains
    if (post.images.length <= 1) {
        throw new AppError("At least one image is required for the post", 400);
    }

    // Delete the image
    await imageModel.findByIdAndDelete(image_id);

    // Remove image reference from post
    post.images = post.images.filter((img: any) => img.toString() !== image_id);
    await post.save();

    res.json({ status: true, message: "Image Deleted Successfully" });
});

export const createPost = expressAsyncHandler(async (req: any, res: Response) => {
    const { description, hashtags, type, post_type } = req.body;
    const user_id = req.user._id;

    if (!req.files || req.files.length === 0)
        throw new AppError("At least one image is required for the post", 400);

    if (req.files.length > 10)
        throw new AppError("At most 10 images in one post", 400);

    // Upload to Cloudinary
    const uploadedUrls = await Promise.all(
        req.files.map((file: any) => uploadToCloud(file.buffer))
    );

    // Temporarily store image URLs, will replace with ObjectIds
    const imageDocs = await imageModel.insertMany(
        uploadedUrls.map(url => ({
            image_url: url,
            user_id
        }))
    );

    const post = await postModel.create({
        description,
        user_id,
        hashtags: JSON.parse(hashtags),
        type,
        post_type,
        images: imageDocs.map((img: any) => img._id)
    });

    // Now link post_id in each image
    await Promise.all(
        imageDocs.map((img: any) => imageModel.findByIdAndUpdate(img._id, { post_id: post._id }))
    );

    res.json({ status: true, message: "Post Created", data: post });
});

export const updatePost = expressAsyncHandler(async (req: any, res: Response) => {
    const { post_id } = req.params;
    const { description, hashtags, type, post_type } = req.body;
    const user_id = req.user._id;

    const existingPost = await postModel.findOne({ _id: post_id, user_id });
    if (!existingPost) throw new AppError("Post Not Found", 404);

    let imageIds = existingPost.images;

    if (req.files && req.files.length > 0) {
        if (imageIds.length + req.files.length > 10)
            throw new AppError("At most 10 images in one post", 400);

        const uploadedUrls = await Promise.all(
            req.files.map((file: any) => uploadToCloud(file.buffer))
        );

        const imageDocs = await imageModel.insertMany(
            uploadedUrls.map(url => ({
                image_url: url,
                user_id,
                post_id
            }))
        );

        imageIds = [...imageIds, ...imageDocs.map((img: any) => img._id)];
    }

    const updatedPost = await postModel.findOneAndUpdate(
        { _id: post_id, user_id },
        {
            description,
            hashtags,
            type,
            post_type,
            images: imageIds
        },
        { new: true }
    );

    res.json({ status: true, message: "Post Updated", data: updatedPost });
});


export const deletePost = expressAsyncHandler(async (req: any, res: Response) => {
    const { post_id } = req.params;
    const user_id = req.user._id;
    const existingPost = await postModel.findOne({ _id: post_id, user_id });
    if (!existingPost) throw new AppError("Post Not Found", 404);
    await postModel.findByIdAndDelete(post_id);
    await imageModel.deleteMany({ post_id, user_id });
    res.json({ status: true, message: "Post Deleted Successfully" });
});



