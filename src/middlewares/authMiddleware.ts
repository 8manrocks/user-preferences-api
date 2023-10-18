import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
export interface UserRequest extends Request {
  user?: JwtPayload;
}
export const authenticateJWT = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
    console.log(req,'token1')
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || "", (err: any, user: any) => {
      if (err) {
        res.clearCookie("token");
        console.log(token,'Forbidden')
        return res.sendStatus(403); // Forbidden

      }
      req.user = user;
      next();
    });
  } else {
    console.log(token,'Unauthorized')
    res.sendStatus(401); // Unauthorized
  }
};
