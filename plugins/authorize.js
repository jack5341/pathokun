import jwt from "jsonwebtoken";

export const AuthorizeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const secret_token = process.env.AUTH_SECRET_TOKEN
    jwt.verify(token, secret_token, (err, user) => {
      if (err) console.log(err);
      console.log(user);
      req.user = user;
      next();
    });
  }
  next();
};
