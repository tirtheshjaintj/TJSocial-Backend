import { Document, Model, model, Schema } from "mongoose";

export interface Post extends Document {
    description: string;
    user_id: Schema.Types.ObjectId;
    images: Schema.Types.ObjectId[];
    hashtags: string[];
    type: "draft" | "posted";
    post_type: "post" | "story";
}

const postSchema = new Schema<Post>(
    {
        description: {
            type: String,
            required: true,
            set: (value: string) => value.trim(),
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        hashtags: {
            type: [String],
            required: true,
            validate: {
                validator: function (val: string[]) {
                    return Array.isArray(val) && val.length > 0;
                },
                message: "At least one hashtag is required",
            },
        },
        images: {
            type: [Schema.Types.ObjectId],
            ref: "Image",
            required: true,
            validate: {
                validator: function (val: Schema.Types.ObjectId[]) {
                    return Array.isArray(val) && val.length > 0;
                },
                message: "At least one image is required",
            },
        },
        type: {
            type: String,
            enum: ["draft", "posted"],
            default: "posted",
        },
        post_type: {
            type: String,
            enum: ["post", "story"],
            default: "post"
        }
    },
    { timestamps: true }
);

postSchema.index({ user_id: 1 });

const postModel: Model<Post> = model<Post>('Post', postSchema);

export default postModel;
