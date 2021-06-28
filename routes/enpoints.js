import { Router } from "express";
const route = Router();

// Models
import { endPointSchema } from "@models/services.model";

// Plugins
import { AuthorizePrivate } from "@plugins/authorize";

route.get("/:usr/:point", async (req, res) => {
  const { point } = req.params;
  const uuid = req.uuid;

  const find = await endPointSchema.findOne({ uuid: uuid });
  if (!find) {
    res.status(403).json({ message: "Couldn't find any data" });
    return;
  }

//   const endpoint = (find.endpoint).find(e => e.point)
//   if(!endpoint){

//   }

  res.status(200).json({ data: true });
  return;
});

export default route;
