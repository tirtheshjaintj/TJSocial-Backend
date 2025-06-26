import { Schema, Document, Model, model } from "mongoose";
import bcrypt from "bcrypt";

export interface User extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    account_type: "public" | "private";
    phone_number: string;
    bio?: string;
    profile_pic?: string;
    cover_pic?: string;
    dob: Date;
    verified: boolean;
    otp: string;
    google_id: string;
}

const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^[a-zA-Z\s]+$/.test(v),
                message: "Not a valid name! Only letters and spaces are allowed.",
            },
        },
        username: {
            type: String, required: true, unique: true,
            set: (value: string) => value.trim().toLowerCase(),
            validate: {
                validator: (v: string) => /^\S+$/.test(v),
                message: "Username cannot contain spaces or whitespace characters.",
            },
        },
        account_type: {
            type: String,
            enum: ["private", "public"],
            required: true,
            default: "public"
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
                message: "Not a valid email!",
            },
        },
        password: { type: String, required: true },
        phone_number: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^[0-9]{10}$/.test(v),
                message: "Not a valid phone number! It must be 10 digits.",
            },
        },
        bio: { type: String, default: "I am TJ Social User" },
        profile_pic: {
            type: String,
            validate: {
                validator: (v: string) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
                message: "Not a valid URL!",
            },
        },
        cover_pic: {
            type: String,
            validate: {
                validator: (v: string) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
                message: "Not a valid URL!",
            },
        },
        dob: {
            type: Date,
            required: true,
            validate: {
                validator: (value: Date) => {
                    const today = new Date();
                    const thirteenYearsAgo = new Date(
                        today.getFullYear() - 13,
                        today.getMonth(),
                        today.getDate()
                    );
                    return value <= thirteenYearsAgo;
                },
                message: "User must be at least 13 years old.",
            },
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        },
        otp: {
            type: String,
            validate: {
                validator: function (val) {
                    return !val || val?.length == 6;
                },
                message: "OTP must be 6 digits"
            }
        },
        google_id: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || /^\d{21}$/.test(v);
                },
                message: props => `Not Valid Google ID`
            },
            unique: true,
            sparse: true // Allows multiple `null` values
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const UserModel: Model<User> = model<User>("User", userSchema);
export default UserModel;
