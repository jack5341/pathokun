import { Router } from "express";
import jwt from "jsonwebtoken";
const route = Router();

// Models
import { endPointSchema } from "@models/services.model";

// Plugins
import { AuthorizePanel } from "@plugins/authorize";

route.post("/endpoint", AuthorizePanel, async (req, res) => {
  const { role, username, uuid } = req.user;
  if (!role && !username && !uuid) {
    res.sendStatus(401);
    return;
  }

  const { Endpoint, Content } = req.body;
  if (Endpoint === username) {
    res.status(403).json({ message: "Endpoint can not be same with your username!" });
    return;
  }

  // const find = await endPointSchema.findOne({ uuid: uuid });
  // if (find.endpoint) {
  //   find.endpoint = [...find.endpoint, { point: Endpoint, Content: Content }];
  //   find.save();
  //   res.status(200).json({ message: "Created and Imported data to new Endpoint succesfully!" });
  //   return
  // } else {
  const data = new endPointSchema({
    uuid: uuid,
    endpoint: [{ point: Endpoint, Content }],
    date: Date.now(),
  });
  data.save();
  res.status(200).json({ message: "Created new Endpoint succesfully!" });
  return;
});

export default route;
