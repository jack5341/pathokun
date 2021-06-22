import crypto from "crypto";
import * as yup from "yup";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const route = Router();

// Models
import { SignupSchema } from "../models/auth.model";

const schema = yup.object().shape({
  Username: yup.string().min(6).max(16).required(),
  Password: yup.string().min(6).max(32).required(),
});

route.post("/signup", async (req, res) => {
  const { Username, Password } = req.body;
  const find = await SignupSchema.findOne({ username: Username });

  if (find) {
    res.status(409).json({ message: "This username is already taken." });
    return;
  }

  const validation = schema.validate(req.body);
  if (!validation) {
    res.status(400).json({ message: "Password or Username must be longer than 16 character" });
    return;
  }

  try {
    const user = new SignupSchema({
      uuid: crypto.randomUUID(),
      username: Username,
      password: bcrypt.hashSync(Password, 12),
      date: Date.now(),
      role: 1,
    });

    user.save();

    res.sendStatus(200);
  } catch {
    res.sendStatus(404);
    return;
  }
});

route.post("/signin", async (req, res) => {
  const { Username, Password } = req.body;
  const find = await SignupSchema.findOne({ username: Username });
  if (!find) {
    res.status(403).json({ message: "Invalid username" });
    return;
  }

  const validation = schema.validate(req.body);
  if (!validation) {
    res.status(400).json({ message: "Password or Username must be longer than 16 character" });
  }

  const comparePass = bcrypt.compareSync(Password, find.password);
  if (!comparePass) {
    res.status(401).json({ message: "Invalid Password." });
    return;
  }

  try {
    res.status(200).json({
      token: jwt.sign(
        {
          uuid: find.uuid,
          role: find.role,
          username: find.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      ),
    });
    return;
  } catch {
    res.status(404);
    return;
  }
});

export default route;
