// dotenv vars
import dotenv from 'dotenv'
dotenv.config();

// db
import { connectDB } from "@utils/index.js"

// server
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path"

const app = express();
app.use(cors());
app.set("view-engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", async(req ,_ ,next) => {
  req.db = await connectDB()
  next()
}, require('@routes/api').default)

app.get("/", async(_, res) => {
  const DATABASE = await connectDB()
  const db = DATABASE.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION ? process.env.DB_COLLECTION : "pathokun")
  const elements = await db.find({}).toArray()
  
  res.render("index.ejs", { data: elements })
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));