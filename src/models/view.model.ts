import { Document, Model, model, Schema } from "mongoose";

export interface View extends Document {
    user_id: Schema.Types.ObjectId;
    post_id: Schema.Types.ObjectId;
}

const ViewSchema = new Schema<View>({
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

ViewSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});

const ViewModel: Model<View> = model<View>("View", ViewSchema);

export default ViewModel;