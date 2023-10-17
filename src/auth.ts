import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/user";

export const generateJWT = (username: string) => {
    return jwt.sign({ username }, 'YOUR_SECRET_KEY', { expiresIn: '5m' });
}

export const generateRefreshToken = async (username: string) => {
    const token = jwt.sign({}, 'YOUR_REFRESH_TOKEN_SECRET_KEY');
    await User.updateOne({ username }, { refreshToken: token });
    return token;
}

export const verifyPassword = async (hashedPassword: string, password: string) => {
    return await bcrypt.compare(password, hashedPassword);
}
