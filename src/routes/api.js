import { Router } from "express"
const route = Router()

route.post("/point", (req,res) => {
    console.log(req.body)
})

export default route