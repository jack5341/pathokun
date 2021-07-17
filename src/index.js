import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv, { parse } from "dotenv";
import path from "path"
import open from "open"
import fs from "fs-extra"
const app = express();
dotenv.config();

// Routes
import API from "./routes/api";

app.use(cors());
app.set("view-engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", API)

app.get("/", async(req, res) => {
  const parsedFile = await fs.readJSON(path.join(__dirname, "..", "master", ".", "db", "db.json"))
  res.render("index.ejs", { data: parsedFile })
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;
// open(`http://localhost:${PORT}`);
app.listen(PORT);
