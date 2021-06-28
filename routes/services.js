import { Router } from "express";
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

  try {
    const find = await endPointSchema.findOne({ uuid: uuid });
    if (!find) {
      const data = new endPointSchema({
        uuid: uuid,
        endpoint: [{ point: Endpoint, Content }],
        date: Date.now(),
      });
      await data.save();
      res.status(200).json({ message: "Succesfully Created new Breakpoint" });
      return;
    } else {
      if (find.endpoint) {
        find.endpoint = [{ point: Endpoint, Content }];
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

export default route;
