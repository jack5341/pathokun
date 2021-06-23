import { Router } from "express";
import jwt from "jsonwebtoken";
const route = Router();

// Models
import { newPathSchema } from "@models/services.model";

// Plugins
import { AuthorizePanel } from "@plugins/authorize";

route.post("/pathname", AuthorizePanel, async (req, res) => {
  const { role, username, uuid } = req.user;
  if ((!role, !username, !uuid)) {
    res.sendStatus(403);
    return;
  }

  if ([1, 2, 3].includes(role.toString())) {
    res.sendStatus(401);
    return;
  }

  const { pathname, content } = req.body;
  if (pathname === username) {
    res.status(403).json({ message: "New pathname cannot be same with your username!" });
    return;
  }

  const data = jwt.verify(content, process.env.JWT_SECRET);
  if (!data) {
    res.sendStatus(401);
    return;
  }

  const find = newPathSchema.find({ uuid: uuid });
  if (find) {
    res.status(401).json({ message: "Couldn't find this UUID" });
    return;
  }

  data.uuid = uuid;
  data.pathnames = [pathname];
  const newData = new newPathSchema(data);
  newData.save();
  res.end();
});

export default route;
