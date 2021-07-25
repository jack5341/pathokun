// dotenv vars
import dotenv from 'dotenv'
dotenv.config();

// db
import * as utils from "./utils/index.js"
utils.createDatabase()

// server
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path"
import fs from "fs-extra"

const app = express();
app.use(cors());
app.set("view-engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", require('@routes/api').default)

app.get("/", async(_, res) => {
  const parsedFile = await fs.readJSON(path.join(__dirname, "..", "master", ".", "db", "db.json"))
  res.render("index.ejs", { data: parsedFile })
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
