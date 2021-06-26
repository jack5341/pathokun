
import jwt from "jsonwebtoken";

export const AuthorizePanel = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403)
        return
      }
      req.user = user;
      next();
    });
  }
  next();
};

export const AuthorizePrivate = (req,res,next) => {
  
}