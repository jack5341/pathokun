import { Router } from "express"
import fs from "fs-extra"
import path from "path"
import jwt from "jsonwebtoken"
const route = Router()

import db from "@db/db.json"
import { fetchAuthorize } from "@middlewares/authorize"

route.get("/getprivtoken", (req, res) => {
    const signedToken = jwt.sign({key: db.secret_key}, process.env.JWT_PRIVATE_SECRET) 
    res.status(200).json({token: signedToken})
})

route.post("/point", async(req,res) => {
    console.log(req.body)
    const { url, description, content, date } = req.body
    console.log(req.body)

    if(!url || !content) {
        res.status(400).send()
        return
    }

    console.log(true)
    const dbValiate = await db.endpoint.find(x => x.url === url)

    if(dbValiate) {
        res.status(400).send({message: "This url is already created!"})
        return
    }

    await db.endpoint.push({
        url: url,
        description: description,
        content: content,
        date: date
    })

    await fs.writeJSON(path.join("master", ".", "db", "db.json"), db)    
    return res.status(200).send()
})

route.delete("/point", async(req,res) => {
    const { index } = req.query

    if(!index) {
        res.status(400).send("Bad Request")
        return
    }

    db.endpoint.splice(index, 1)
    await fs.writeJSON(path.join("master", ".", "db", "db.json"), db)
    res.status(200).send()
})

route.get("/fetch/:point", fetchAuthorize, (req,res) => {
    const index = db.endpoint.findIndex(x => x.url === req.params.point)

    if(!index == null){
        res.status(400).send("Bad Request")
        return
    }

    res.status(200).send({
        data: db.endpoint[index]
    })    
})

export default route