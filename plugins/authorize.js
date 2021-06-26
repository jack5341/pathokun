import jwt from "jsonwebtoken";

// Schemas
import { SignupSchema } from "@models/auth.model";

export const AuthorizePanel = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      req.user = user;
      next();
    });
  }
  res.sendStatus(403);
  return;
};

export const AuthorizePrivate = async (req, res, next) => {
  const header = req.headers.authorization;
  const { user, endpoint } = req.params;

  const find = await SignupSchema.findOne({ username: user });

  if (!find) {
    res.status(403).json({ message: "Invalid user" });
    return;
  }

  const findEndpoint = console.log(find.filter(x => x.endpoint === endpoint))
  // if(!endpoint){
  //   res.status(403).json({ message: "Invalid Endpoint" })
  //   return
  // }

  if (header) {
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.JWT_PRIVATE_SECRET, (err, doc) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      req.uuid = doc;
      next();
    });
  }
  res.status(403).json({ message: "You have to set your token as authorization" });
  return;
};
