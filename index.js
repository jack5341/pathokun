import express from "express";
import cors from "cors"
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



const PORT = 4000 || process.env.PORT;
app.listen(PORT);
