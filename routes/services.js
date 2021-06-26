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
      console.log(1);
      res.status(200).json({ message: "Succesfully Created new Breakpoint" });
      return;
    } else {
      if (!find.endpoint) {
        console.log(2);
        res.end();
        return;
      } else {
        console.log(3);
        res.end();
        return;
      }
    }
  } catch (e) {
    console.log(e);
    res.end();
    return;
  }
});

export default route;
