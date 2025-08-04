"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.deleteImage = exports.getUserPost = exports.getMyPosts = exports.getPost = exports.getAllPosts = void 0;
const cloud_helper_1 = __importDefault(require("../helpers/cloud.helper"));
const post_model_1 = __importDefault(require("../models/post.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const error_helper_1 = require("../helpers/error.helper");
const comment_model_1 = __importDefault(require("../models/comment.model"));
const like_model_1 = __importDefault(require("../models/like.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const image_model_1 = __importDefault(require("../models/image.model"));
const bookmark_model_1 = __importDefault(require("../models/bookmark.model"));
exports.getAllPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    // Get all private user IDs
    const privateUserIds = yield user_model_1.default.find({ account_type: 'private' }).distinct('_id');
    // Fetch posts excluding private users
    const posts = yield post_model_1.default
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
    const [likeCounts, commentCounts, total] = yield Promise.all([
        like_model_1.default.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        comment_model_1.default.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        post_model_1.default.countDocuments({
            user_id: { $nin: privateUserIds },
            type: "posted"
        })
    ]);
    const likeMap = new Map(likeCounts.map(i => [i._id.toString(), i.count]));
    const commentMap = new Map(commentCounts.map(i => [i._id.toString(), i.count]));
    const enrichedPosts = posts.map(post => (Object.assign(Object.assign({}, post), { like_count: likeMap.get(post._id.toString()) || 0, comment_count: commentMap.get(post._id.toString()) || 0 })));
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
}));
exports.getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    // Get all private user IDs
    const privateUserIds = yield user_model_1.default.find({ account_type: 'private' }).distinct('_id');
    const post = yield post_model_1.default
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
    if (!post)
        throw new error_helper_1.AppError("Post Not Found", 404);
    const [comment_count, like_count] = yield Promise.all([
        comment_model_1.default.countDocuments({ post_id }),
        like_model_1.default.countDocuments({ post_id })
    ]);
    res.json({
        status: true,
        message: "Post Found",
        data: Object.assign(Object.assign({}, post), { comment_count,
            like_count })
    });
}));
exports.getMyPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const user_id = req.user._id;
    // Step 1: Fetch paginated posts
    const posts = yield post_model_1.default.find({ user_id })
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
    const [likeCounts, commentCounts, likedPosts, bookmarkedPosts] = yield Promise.all([
        like_model_1.default.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        comment_model_1.default.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        like_model_1.default.find({ user_id, post_id: { $in: postIds } }).select("post_id").lean(),
        bookmark_model_1.default.find({ user_id, post_id: { $in: postIds } }).select("post_id").lean()
    ]);
    // Step 3: Create maps for counts and liked IDs
    const likeMap = new Map(likeCounts.map(i => [i._id.toString(), i.count]));
    const commentMap = new Map(commentCounts.map(i => [i._id.toString(), i.count]));
    const likedPostIdSet = new Set(likedPosts.map(like => like.post_id.toString()));
    const bookmarkedPostIdSet = new Set(bookmarkedPosts.map(bookmark => bookmark.post_id.toString()));
    // Step 4: Enrich posts with counts and liked status
    const enrichedPosts = posts.map(post => (Object.assign(Object.assign({}, post), { like_count: likeMap.get(post._id.toString()) || 0, comment_count: commentMap.get(post._id.toString()) || 0, liked: likedPostIdSet.has(post._id.toString()), bookmarked: bookmarkedPostIdSet.has(post._id.toString()) })));
    res.json({
        status: true,
        message: "Posts fetched successfully",
        data: enrichedPosts
    });
}));
exports.getUserPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const user = yield user_model_1.default.find({ _id: user_id, account_type: "public", verified: true });
    const viewer_id = req.user._id;
    if (!user)
        throw new error_helper_1.AppError("No Posts for User Found", 404);
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    // Step 1: Fetch paginated posts
    const posts = yield post_model_1.default.find({ user_id, type: "posted" })
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
    const [likeCounts, commentCounts, likedPosts, bookmarkedPosts] = yield Promise.all([
        like_model_1.default.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        comment_model_1.default.aggregate([
            { $match: { post_id: { $in: postIds } } },
            { $group: { _id: "$post_id", count: { $sum: 1 } } }
        ]),
        like_model_1.default.find({ user_id: viewer_id, post_id: { $in: postIds } }).select("post_id").lean(),
        bookmark_model_1.default.find({ user_id: viewer_id, post_id: { $in: postIds } }).select("post_id").lean()
    ]);
    // Step 3: Create maps for counts and liked IDs
    const likeMap = new Map(likeCounts.map(i => [i._id.toString(), i.count]));
    const commentMap = new Map(commentCounts.map(i => [i._id.toString(), i.count]));
    const likedPostIdSet = new Set(likedPosts.map(like => like.post_id.toString()));
    const bookmarkedPostIdSet = new Set(bookmarkedPosts.map(bookmark => bookmark.post_id.toString()));
    // Step 4: Enrich posts with counts and liked status
    const enrichedPosts = posts.map(post => (Object.assign(Object.assign({}, post), { like_count: likeMap.get(post._id.toString()) || 0, comment_count: commentMap.get(post._id.toString()) || 0, liked: likedPostIdSet.has(post._id.toString()), bookmarked: bookmarkedPostIdSet.has(post._id.toString()) })));
    console.log(enrichedPosts);
    res.json({
        status: true,
        message: "Posts fetched successfully",
        data: enrichedPosts
    });
}));
exports.deleteImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { image_id } = req.params;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Validate input
    if (!image_id || !user_id) {
        throw new error_helper_1.AppError("Invalid Request", 400);
    }
    // Find image belonging to the user
    const existingImage = yield image_model_1.default.findOne({ _id: image_id, user_id });
    if (!existingImage) {
        throw new error_helper_1.AppError("Image Not Found", 404);
    }
    // Fetch the associated post
    const post = yield post_model_1.default.findById(existingImage.post_id);
    if (!post) {
        throw new error_helper_1.AppError("Associated Post Not Found", 404);
    }
    // Ensure at least one image remains
    if (post.images.length <= 1) {
        throw new error_helper_1.AppError("At least one image is required for the post", 400);
    }
    // Delete the image
    yield image_model_1.default.findByIdAndDelete(image_id);
    // Remove image reference from post
    post.images = post.images.filter((img) => img.toString() !== image_id);
    yield post.save();
    res.json({ status: true, message: "Image Deleted Successfully" });
}));
exports.createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, hashtags, type, post_type } = req.body;
    const user_id = req.user._id;
    if (!req.files || req.files.length === 0)
        throw new error_helper_1.AppError("At least one image is required for the post", 400);
    if (req.files.length > 10)
        throw new error_helper_1.AppError("At most 10 images in one post", 400);
    // Upload to Cloudinary
    const uploadedUrls = yield Promise.all(req.files.map((file) => (0, cloud_helper_1.default)(file.buffer)));
    // Temporarily store image URLs, will replace with ObjectIds
    const imageDocs = yield image_model_1.default.insertMany(uploadedUrls.map(url => ({
        image_url: url,
        user_id
    })));
    const post = yield post_model_1.default.create({
        description,
        user_id,
        hashtags: JSON.parse(hashtags),
        type,
        post_type,
        images: imageDocs.map((img) => img._id)
    });
    // Now link post_id in each image
    yield Promise.all(imageDocs.map((img) => image_model_1.default.findByIdAndUpdate(img._id, { post_id: post._id })));
    res.json({ status: true, message: "Post Created", data: post });
}));
exports.updatePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const { description, hashtags, type, post_type } = req.body;
    const user_id = req.user._id;
    const existingPost = yield post_model_1.default.findOne({ _id: post_id, user_id });
    if (!existingPost)
        throw new error_helper_1.AppError("Post Not Found", 404);
    let imageIds = existingPost.images;
    if (req.files && req.files.length > 0) {
        if (imageIds.length + req.files.length > 10)
            throw new error_helper_1.AppError("At most 10 images in one post", 400);
        const uploadedUrls = yield Promise.all(req.files.map((file) => (0, cloud_helper_1.default)(file.buffer)));
        const imageDocs = yield image_model_1.default.insertMany(uploadedUrls.map(url => ({
            image_url: url,
            user_id,
            post_id
        })));
        imageIds = [...imageIds, ...imageDocs.map((img) => img._id)];
    }
    const updatedPost = yield post_model_1.default.findOneAndUpdate({ _id: post_id, user_id }, {
        description,
        hashtags,
        type,
        post_type,
        images: imageIds
    }, { new: true });
    res.json({ status: true, message: "Post Updated", data: updatedPost });
}));
exports.deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const user_id = req.user._id;
    const existingPost = yield post_model_1.default.findOne({ _id: post_id, user_id });
    if (!existingPost)
        throw new error_helper_1.AppError("Post Not Found", 404);
    yield post_model_1.default.findByIdAndDelete(post_id);
    yield image_model_1.default.deleteMany({ post_id, user_id });
    res.json({ status: true, message: "Post Deleted Successfully" });
}));
