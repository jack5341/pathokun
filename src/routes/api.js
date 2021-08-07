import { response, Router } from "express";
import jwt from "jsonwebtoken";

const route = Router();

route.get("/getprivtoken", (_, res) => {
    const signedToken = jwt.sign({ permissions: ["read"] }, process.env.SECRET_KEY);
    res.status(200).json({ token: signedToken });
});

route.post("/point", async (req, res) => {
    const DATABASE = req.db;
    const { url, description, content, date, isprivate } = req.body;

    if (!url || !content) {
        res.status(400).send();
        return;
    }

    const data = {
        url: url,
        description: description ? description : null,
        content: content,
        isprivate: isprivate,
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

route.get("/fetch/:point", async(req, res) => {
    const DATABASE = req.db;
    const db = DATABASE.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION ? process.env.DB_COLLECTION : "pathokun");
    const result = await db.findOne({ url: req.params.point });

    if (!result) {
        res.status(400).send("Bad Request");
        return;
    }

    if(result.isprivate) {
        req.auth ? () => {
            res.status(200).send({
                data: result,   
            })
            return 
        } : () => {
            res.status(401).send()
            return
        }
    }

    res.status(200).send({
        data: result,
    });
});

export default route;
