import { Router } from "express";
const route = Router();

// Plugins 
import { AuthorizePrivate } from "@plugins/authorize"

route.get("/:usr/:point", AuthorizePrivate, (req,res) => {
    res.send(true)
})

export default route