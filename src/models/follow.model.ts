import { Document, Model, model, Schema } from "mongoose";

export interface Follow extends Document {
    user_id: Schema.Types.ObjectId;
    follow_id: Schema.Types.ObjectId;
}

const FollowSchema = new Schema<Follow>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    follow_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

FollowSchema.index({ user_id: 1, follow_id: 1 }, {
    unique: true
});

const FollowModel: Model<Follow> = model<Follow>("Follow", FollowSchema);

export default FollowModel;