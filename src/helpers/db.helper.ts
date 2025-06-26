import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "");
        console.log(`MongoDB Connected At ${db.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;