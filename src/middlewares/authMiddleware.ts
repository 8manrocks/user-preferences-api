import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
export interface UserRequest extends Request {
    user?: JwtPayload;
}
export const authenticateJWT = (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'YOUR_SECRET_KEY', (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user as JwtPayload;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};
