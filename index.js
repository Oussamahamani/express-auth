import express from 'express'
import 'dotenv/config'

import connectDB from './db.js'
import User from "./models/User.js"
const app = express()

const port = 8080

app.use(express.json())

app.post("/api/signup",async(req,res)=>{
    try {
         console.log(req.body)
    let newUser = await User.create(req.body)
    res.send(newUser)
    } catch (error) {
        res.json({error:error.message}).status(401)
    }
   
})

app.listen(port, () => {
    console.log('Listening on port: ', port)
    connectDB()
})