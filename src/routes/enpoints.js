import { Router } from "express";
const route = Router();

// Models
import { endPointSchema } from "@models/services.model";

// Plugins
import { AuthorizePrivate } from "@middlewares/authorize";

route.get("/:usr/:point", AuthorizePrivate, async (req, res) => {
  const { point } = req.params;
  const uuid = req.uuid;

  const find = await endPointSchema.findOne({ user_id: uuid });
  if (!find) {
    res.status(403).json({ message: "Couldn't find any data" });
    return;
  }

  const data = find.endpoint.find((x) => x.point === point);
  if (!data) {
    res.status(403).json({ message: "Couldn't find any content" });
    return;
  }

  res.status(200).json({ data: data.content });
  return;
});

export default route;
