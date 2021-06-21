import * as yup from "yup";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import users from "../constants/users.json";

const schema = yup.object().shape({
  Username: yup.string().min(6).max(16).required(),
  Password: yup.string().min(6).max(16).required(),
});

const refreshTokenSecret = "yourrefreshtokensecrethere";

export const SignIn = async (req, res) => {
  await schema.validate(req.body).catch((e) => res.status(400).json({ message: e.errors[0] }));

  const validate = users.find((e) => e.username === req.body.Username);
  if (!validate) {
    res.status(400).json({ message: "Could`t find any username as your." });
  }
  const comparePass = await bcrypt.compare(req.body.Password, validate.password)
  if (!comparePass) {
    res.status(400).json({ message: "Password is invalid" });
  }

  const accestoken = jwt.sign(
    { username: validate.username, role: validate.role },
    refreshTokenSecret,
    { expiresIn: "20m" }
  );
  res.status(200).json({ accestoken });
};

export const SignUp = async (req, res) => {
  await schema.validate(req.body).catch((e) => res.status(400).json({ message: e.errors[0] }));

  const validate = users.find((e) => e.username === req.body.Username);
  if (validate) res.status(400).json({ message: "This username is already taken." });

  const hasshedPass = await bcrypt.hash(req.body.Password, 12);
  const usr = {
    user_name: req.body.Username,
    password: hasshedPass,
    role: 0,
  };

  const accestoken = jwt.sign(
    { username: usr.user_name, role: usr.role },
    refreshTokenSecret,
    { expiresIn: "20m" }
  );
  res.status(200).json({ accestoken });
};
