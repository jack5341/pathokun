import { Router } from "express";
import jwt from "jsonwebtoken";
const route = Router();

// Models
import { endPointSchema } from "@models/services.model";
import { SignupSchema } from "@models/auth.model";

// Plugins
import { AuthorizePanel } from "@plugins/authorize";

route.get("/privatetoken", AuthorizePanel, async (req, res) => {
  const { role, username, userid } = req.user;
  if (!role && !username && !userid) {
    res.sendStatus(401);
    return;
  }

  const find = await SignupSchema.findOne({ _id: userid });
  if (!find) {
    res.status(403).json({ message: "Couldn't find any endpoint" });
    return;
  }

  const token = jwt.sign(find._id.toString(), find._id.toString());

  res.status(200).json({ message: token });
  return;
});

route.post("/endpoint", AuthorizePanel, async (req, res) => {
  const { role, username, userid } = req.user;
  if (!role && !username && !userid) {
    res.sendStatus(401);
    return;
  }

  const { Endpoint, Content } = req.body;
  if (Endpoint === username) {
    res.status(403).json({ message: "Endpoint can not be same with your username!" });
    return;
  }

  const find = await endPointSchema.findOne({ user_id: userid });
  const content = Content.split(" ").join("");
  try {
    if (!find) {
      const data = new endPointSchema({
        user_id: userid,
        endpoint: [{ point: Endpoint, content }],
        date: Date.now(),
      });
      await data.save();
      res.status(200).json({ message: "Succesfully Created new Breakpoint" });
      return;
    } else {
      if (find.endpoint) {
        find.endpoint = [{ point: Endpoint, content }];
        find.save();
        res.status(200).json({ message: "Succesfully Updated your Breakpoint" });
      } else {
        res.status(400).json({ message: "Something went wrong!" });
      }
    }
  } catch (e) {
    res.status(400).json({ message: "Something went wrong!" });
    return;
  }
});

route.get("/endpoint", AuthorizePanel, async (req, res) => {
  const { role, username, userid } = req.user;
  if (!role && !username && !userid) {
    res.sendStatus(401);
    return;
  }

  const find = await endPointSchema.findOne({ user_id: userid });
  if (!find) {
    res.status(403).json({ message: "Couldn't find any endpoint" });
    return;
  }

  res.status(200).json(find.endpoint);
  return;
});

export default route;
