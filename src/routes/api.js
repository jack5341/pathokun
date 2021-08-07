import { Router } from "express";
import fs from "fs-extra";
import path from "path";
import jwt from "jsonwebtoken";

const route = Router();

route.get("/getprivtoken", (_, res) => {
    const signedToken = jwt.sign({ permissions: ["read"] }, process.env.SECRET_KEY);
    res.status(200).json({ token: signedToken });
    console.log(signedToken);
});

route.post("/point", async(req, res) => {
    const DATABASE = req.db;
    const { url, description, content, date } = req.body;

    if (!url || !content) {
        res.status(400).send();
        return;
    }

    const data = {
        url: url,
        description: description ? description : null,
        content: content,
        date: date ? date : null,
    };

    const db = DATABASE.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION ? process.env.DB_COLLECTION : "pathokun");
    const validate = await db.findOne({ url: url });

    validate ? () => db.updateOne({ url: url }, data) : db.insertOne(data);
    res.status(200).send();
    return;
});

route.delete("/point", async (req, res) => {
    const { url } = req.query;
    const DATABASE = req.db;

    if (!url) {
        res.status(400).send("Bad Request");
        return;
    }

    const db = DATABASE.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION ? process.env.DB_COLLECTION : "pathokun");
    await db.deleteOne({ url: url });

    res.status(200).send();
});

route.get("/fetch/:point", (req, res) => {
    const index = db.endpoint.findIndex((x) => x.url === req.params.point);

    if (!index == null) {
        res.status(400).send("Bad Request");
        return;
    }

    res.status(200).send({
        data: db.endpoint[index],
    });
});

export default route;
