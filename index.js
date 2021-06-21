import express from "express";
import cors from "cors"
import morgan from "morgan";
import crypto from "crypto"
const app = express();

// Routes
import auth from "./routes/auth";
import services from "./routes/services";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/a", auth);
app.use("/s", services);

app.get("/", (req, res) => {
    res.status(200).send(crypto.randomUUID().fixed())
});

const PORT = 4000 || process.env.PORT;
app.listen(PORT);
