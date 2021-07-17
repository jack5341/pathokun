import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path"
import open from "open"
const app = express();
dotenv.config();

app.use(cors());
app.set("view-engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../public'))

app.get("/", (req, res) => {
  res.render("index.ejs")
  res.status(200).end();
});

mongoose.connect(
  process.env.DB_STRING,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log("COULDNT CONNECT TO DB");
    console.log("CONNECTED TO DB SUCCESFULLY");
  }
);

const PORT = process.env.PORT || 4000;
open(`http://localhost:${PORT}`);
app.listen(PORT);
