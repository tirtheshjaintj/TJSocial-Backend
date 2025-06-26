import { Document, Model, model, Schema } from "mongoose";

export interface Chat extends Document {
    sender_id: Schema.Types.ObjectId;
    receiver_id: Schema.Types.ObjectId;
    message: string;
    image_url: string;
}

const ChatSchema = new Schema<Chat>({
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        set: (v: string) => v.trim()
    },
    image_url: {
        type: String,
        validate: {
            validator: (v: string) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
            message: "Not a valid URL!"
        }
    }
}, { timestamps: true });

ChatSchema.index({ user_id: 1, sender_id: 1 });

const ChatModel: Model<Chat> = model<Chat>("Chat", ChatSchema);

export default ChatModel;