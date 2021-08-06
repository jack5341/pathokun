import { Router } from "express"
import fs from "fs-extra"
import path from "path"
import jwt from "jsonwebtoken"
import { MongoClient } from "mongodb";
import { fetchAuthorize } from "@middlewares/authorize"

const db = fs.readJsonSync(path.join(__dirname, '../../master/db/db.json'))
const route = Router()

route.get("/getprivtoken", (req, res) => {
    const signedToken = jwt.sign({ permissions: ["read"] }, process.env.SECRET_KEY)
    res.status(200).json({token: signedToken})
    console.log(signedToken)
})

route.post("/point", (req,res) => {
    const {DB_STRING, DB_TYPE, DB_NAME} = req.db

    if (!DB_TYPE) throw "one error occurred while try to connect database."

    const { url, description, content, date } = req.body

    if(!url || !content) {
        res.status(400).send()
        return
    }

    if(DB_TYPE === "MONGODB") {
        const data = {
            url: url,
            description: description ? description : null,
            content: content,
            date: date ? date : null
        }
        
        MongoClient.connect(DB_STRING, async(err, db) => {
            if (err) throw err
            const DATABASE = db.db(DB_NAME).collection(process.env.DB_COLLECTION  ? process.env.DB_COLLECTION : "pathokun")
            const validate = await DATABASE.findOne({url: url})

            validate ? () => DATABASE.updateOne({url: url}, data) : DATABASE.insertOne(data, (err, _) => { if(err) throw err }) 
        })
        
        res.status(200).send()
        return
    }

    // if (!db.endpoint) {
    //     db.endpoint = []
    //     fs.writeJSON(path.join("master", ".", "db", "db.json"), db)
    //     return
    // }

    // const dbValiate = await db.endpoint.find(x => x.url === url)

    // if(dbValiate) {
    //     res.status(400).send({message: "This url is already created!"})
    //     return
    // }

    // await db.endpoint.push({
    //     url: url,
    //     description: description,
    //     content: content,
    //     date: date
    // })

    // fs.writeJSON(path.join("master", ".", "db", "db.json"), db)
    // return res.status(200).send()
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
