import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
const expiresIn = process.env.TOKEN_EXPIRATION || "1h";
interface User {
    id: string;
}
export const setUser = (user: any) => {
    //@ts-ignore
    const options: SignOptions = { expiresIn };
    return jwt.sign({ id: user._id }, JWT_SECRET, options); // payload is an object
};

export const getUser = (token: string): User | null => {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as User;
    } catch (error) {
        console.error(error);
        return null;
    }
};
