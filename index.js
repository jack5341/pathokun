import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
const app = express();
dotenv.config();

// Routes
import AUTH from "@routes/authentication";
import SERVICES from "@routes/services";
import ENDPOINT from "@routes/enpoints";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/a", AUTH);
app.use("/s", SERVICES);
app.use("/e", ENDPOINT);

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

const PORT = 4000 || process.env.PORT;
app.listen(PORT);
