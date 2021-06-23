import crypto from "crypto";
import * as yup from "yup";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const route = Router();

// Models
import { SignupSchema } from "@models/auth.model";

// Plugins
import { ResetPassword } from "@plugins/mailer";

const schema = yup.object({
  Username: yup.string().min(6).max(16).required(),
  Email: yup.string().email(),
  Password: yup.string().min(6).max(32).required(),
});

route.post("/signup", async (req, res) => {
  const { Username, Password, Email } = req.body;

  const find = await SignupSchema.findOne({ email: Email });

  if (find) {
    res.status(409).json({ message: "You have already a account with this email." });
    return;
  }

  try {
    const user = new SignupSchema({
      uuid: crypto.randomUUID(),
      reset_token: crypto.randomBytes(48).toString("hex"),
      email: Email,
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

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error });
  }

  const comparePass = bcrypt.compareSync(Password, find.password);
  if (!comparePass) {
    res.status(403).json({ message: "Invalid Password." });
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

route.post("/password-forgot", async (req, res) => {
  const { Email, Username } = req.body;
  if (!Email && !Username) {
    res.status(403).json({ message: "Please enter your email adress or username" });
    return;
  }

  const find = await SignupSchema.findOne({ email: Email });
  if (!find) {
    res.status(403).json({ message: "This mail is not available" });
    return;
  }

  if (Username !== find.username) {
    res.status(403).json({ message: "Doens't match username with email" });
    return;
  }

  ResetPassword(Email, {
    subject: "I FORGOT PASSWORD",
    username: Username,
    token: jwt.sign({ token: find.reset_token }, process.env.JWT_RESET_SECRET, {
      expiresIn: process.env.JWT_RESET_EXPIRE,
    }),
  });

  res.status(200).json({ message: "Check your mailbox!" });
});

route.put("/reset-password/:username/:token", async (req, res) => {
  const { NewPassword } = req.body;
  const isExpired = jwt.verify(req.params.token, process.env.JWT_RESET_SECRET);
  if (!isExpired) {
    res.status(403).json({ message: "This token is expired." });
    return;
  }

  const find = SignupSchema.findOne({ username: req.params.username });
  if (!find) {
    res.status(403).json({ message: "Invalid username" });
    return;
  }

  if (!isExpired === find.reset_token) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }

  await SignupSchema.findOne({ reset_token: isExpired.token }, (err, doc) => {
    if (err) {
      res.status(403).json({ message: "Something went wrong!" });
      return;
    }
    (doc.password = bcrypt.hashSync(NewPassword, 12)), doc.save();
    res.status(200).json({ message: "Your password changed succesfully!" });
  });
});

export default route;
