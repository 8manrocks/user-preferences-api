import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/user";

export const generateJWT = (username: string) => {
    return jwt.sign({ username }, process.env.JWT_SECRET || '', { expiresIn: '30m' });
}

export const generateRefreshToken = async (username: string) => {
    const token = jwt.sign({}, process.env.JWT_SECRET || '');
    await User.updateOne({ username }, { refreshToken: token });
    return token;
}

export const verifyPassword = async (hashedPassword: string, password: string) => {
    return await bcrypt.compare(password, hashedPassword);
}
