import { Document, Model, model, Schema } from "mongoose";

export interface Post extends Document {
    description: string;
    user_id: Schema.Types.ObjectId;
    images: Schema.Types.ObjectId[];
    type: "draft" | "posted";
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
        images: {
            type: [Schema.Types.ObjectId],
            ref: "Image",
            required: true,
            default: [],
        },
        type: {
            type: String,
            enum: ["draft", "posted"],
            default: "posted",
        },
    },
    { timestamps: true }
);

// ✅ Use regular function so `this` is the query
// postSchema.pre(/^find/, function (this: Query<any, any>, next) {
//     this.populate('images');
//     next();
// });

postSchema.index({ user_id: 1 });

const postModel: Model<Post> = model<Post>('Post', postSchema);

export default postModel;
