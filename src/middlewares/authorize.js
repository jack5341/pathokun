import jwt from "jsonwebtoken";

// Schemas
import { SignupSchema } from "@models/auth.model";
import { endPointSchema } from "@models/services.model";

export const AuthorizePanel = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      console.log(user)
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(403);
    return;
  }
};

export const RoleChecker = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      role = user.role;
      next();
    });
  } else {
    res.sendStatus(403);
    return;
  }
}

export const AuthorizePrivate = async (req, res, next) => {
  const header = req.headers.authorization;
  const { usr } = req.params;

  const find = await SignupSchema.findOne({ username: usr });

  if (!find) {
    res.status(403).json({ message: "Invalid user" });
    return;
  }

  const data = await endPointSchema.findOne({ user_id: find._id });
  if (!data) {
    res.status(403).json({ message: "Invalid Endpoint" });
    return;
  }

  if (header) {
    const token = header.split(" ")[1];
    jwt.verify(token, find._id.toString(), (err, doc) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      req.uuid = doc;
      next();
    });
  } else {
    res.status(403).json({ message: "You have to set your token as authorization" });
    return;
  }
};
