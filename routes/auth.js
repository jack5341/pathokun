import { Router } from "express";
const route = Router();

// Controllers
import { SignIn, SignUp } from "../controllers/authentication";

route.post("/signup", SignUp);

route.post("/signin", SignIn);

route.get("/passwordforget", (req, res) => res.status(200).send("Still at development"));

route.get("/changepassword", (req, res) => res.status(200).send("Still at development"));

export default route;
