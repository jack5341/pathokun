import { Router } from "express"
import fs from "fs-extra"
import path from "path"
import bcrypt from "bcrypt"
const route = Router()

import db from "@db/db.json"

route.get("/getprivtoken", (req, res) => {
    const hasshedToken = bcrypt.hashSync(db.secret_key, 12)
    res.status(200).json({token: hasshedToken})
})

route.post("/point", async(req,res) => {
    const { url, description, content, date } = req.body

    if(!url || !content) {
        res.status(400).send("Bad Request")
        return
    }

    if(db.endpoint.find(x => x.url === url)) {
        res.status(400).json({message: "This url is already created!"})
        return
    }

    await db.endpoint.push({
        url: url,
        description: description,
        content: content,
        date: date
    })

    await fs.writeJSON(path.join("master", ".", "db", "db.json"), db)    
    res.status(200)
})

route.delete("/point", async(req,res) => {
    const { index } = req.query

    if(!index) {
        res.status(400).send("Bad Request")
        return
    }

    db.endpoint.splice(index, 1)
    await fs.writeJSON(path.join("master", ".", "db", "db.json"), db)
    res.status(200)
})

export default route