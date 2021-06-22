import { Router } from "express"
const route = Router()

// Plugins
import { AuthorizeToken } from "../plugins/authorize"

route.post("/addpath", AuthorizeToken, (req,res) => {
    console.log(req.user)
    res.end()
})

export default route