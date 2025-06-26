import { Document, Model, model, Schema } from "mongoose";

export interface Comment extends Document {
    user_id: Schema.Types.ObjectId;
    post_id: Schema.Types.ObjectId;
    comment: String;
}

const CommentSchema = new Schema<Comment>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment: {
        type: String,
        required: true,
        set: (v: string) => v.trim()
    }
}, { timestamps: true });

CommentSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});

const CommentModel: Model<Comment> = model<Comment>("Comment", CommentSchema);

export default CommentModel;