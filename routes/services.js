import { Router } from "express";
import jwt from "jsonwebtoken";
const route = Router();

import users from "../constants/users.json";

// Controllers
import { AllBreakpoints, CreateBreakpoint, CreateAccessToken, GetBreakpoint } from "../controllers/breakpoints";

const refreshTokenSecret = "yourrefreshtokensecrethere";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  res.sendStatus(401);
};

const authorizeJWT = (req, res, next) => {
  const validate = users.find((x) => x.username === req.params.usr);
  if (!validate) res.sendStatus(400);
  const authHeader = req.headers.authorization;
  if (!authHeader) res.sendStatus(401);
  if (!jwt.decode(authHeader.split(" ")[1], validate.uuid)) res.sendStatus(400);
  next();
};

route.get("/:usr/panel/allbreakpoints", AllBreakpoints);

route.post("/:usr/panel/breakpoint", authenticateJWT, CreateBreakpoint);

route.get("/:usr/panel/accesstoken", authenticateJWT, CreateAccessToken);

route.get("/:usr/:point", authorizeJWT, GetBreakpoint)

export default route;
