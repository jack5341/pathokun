import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import users from "../constants/users.json";

export const AllBreakpoints = (req, res) => {
  const { usr } = req.params;
  const validate = users.find((e) => e.username === usr);
  if (!validate) res.sendStatus(404);
  res.status(200).send(validate.breakpoints);
};

export const CreateBreakpoint = (req, res) => {
  const { role, username } = req.user;
  if (role !== "member" && role !== "admin" && role !== "guest") res.sendStatus(403);

  const { point_name } = req.body;
  if (point_name === username)
    res.status(403).json({ message: "New breakpoint can not same with username." });

  const validate = users.find(e => e.username === username);
  if (!validate) res.status(404).send({ message: "This username is invalid." });

  const checkName = validate.breakpoints.find(x => (x[0]).toString() === username)
  if(!checkName) res.status(404).send({message: "Breakpoint can not be same with your username."})
  
  res.status(200).send(true);
};

export const CreateAccessToken = (req, res) => {
  const validate = users.find((e) => e.username === req.params.usr);
  if (!validate) res.sendStatus(404);
  const hasshedId = bcrypt.hashSync(validate.uuid.toString(), 12);
  const token = jwt.sign(hasshedId, validate.uuid);
  res.status(200).json({private_token: token});
};

export const GetBreakpoint = (req, res) => {
  const { usr, point } = req.params;
  const validate = users.find(x => x.username === usr)
  const findPoint = validate.breakpoints.find(x => x[0] === point)
  if(!validate && !findPoint) res.status(404).send({message: "Invalid breakpoint or username."})
  res.status(200).json(findPoint[1])
};
