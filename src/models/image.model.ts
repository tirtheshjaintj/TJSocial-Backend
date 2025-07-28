import { Document, Model, model, Schema } from "mongoose";

export interface Image extends Document {
    user_id: Schema.Types.ObjectId;
    post_id: Schema.Types.ObjectId;
    image_url: string;
}

const imageSchema = new Schema<Image>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    image_url: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
            message: "Not a valid URL!"
        }
    }
}, { timestamps: true });

imageSchema.index({ post_id: 1, user_id: 1 });

const imageModel: Model<Image> = model<Image>("Image", imageSchema);

export default imageModel;