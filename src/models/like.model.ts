import { Document, Model, model, Schema } from "mongoose";

export interface Like extends Document {
    user_id: Schema.Types.ObjectId;
    post_id: Schema.Types.ObjectId;
}

const likeSchema = new Schema({
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

likeSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});

const likeModel: Model<Like> = model<Like>("Like", likeSchema);

export default likeModel;