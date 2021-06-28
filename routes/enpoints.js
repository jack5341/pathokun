import { Router } from "express";
const route = Router();

// Models
import { endPointSchema } from "@models/services.model";

// Plugins
import { AuthorizePrivate } from "@plugins/authorize";

route.get("/:usr/:point", AuthorizePrivate, async (req, res) => {
  const { point } = req.params;
  const uuid = req.uuid;

  const find = await endPointSchema.findOne({ username: uuid });
  if (!find) {
    res.status(403).json({ message: "Couldn't find any data" });
    return;
  }

  res.status(200).json({ data: true });
  return;
});

export default route;
