import { Document, Model, model, Schema } from "mongoose";

export interface Bookmark extends Document {
    user_id: Schema.Types.ObjectId;
    post_id: Schema.Types.ObjectId;
}

const BookmarkSchema = new Schema<Bookmark>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { timestamps: true });

BookmarkSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});

const BookmarkModel: Model<Bookmark> = model<Bookmark>("Bookmark", BookmarkSchema);

export default BookmarkModel;