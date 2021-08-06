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

route.post("/point", async(req,res) => {
    const {DB_STRING, DB_TYPE} = req.db

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
        
        MongoClient.connect(DB_STRING, (err, db) => {
            if (err) throw err

            const DATABASE = db.db("developing")
            DATABASE.collection("pathokun").insertOne(data, (err,res) => {
                if(err) throw err
                console.log(res)
            })
            console.log("Connected to \x1b[42m MongoDB \x1b[0m");
          });
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
