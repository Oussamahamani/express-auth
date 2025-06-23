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

app.post("/api/signin",async (req,res)=>{
    try {
        
        let user = await User.findOne({
            email:req.body.email,
            password:req.body.password
        })
        console.log(user)
        if(!user){
            throw Error("email or password is wrong")
        }
        res.send(user)
    } catch (error) {
        res.status(401).json({error:error.message})
    }
})

app.listen(port, () => {
    console.log('Listening on port: ', port)
    connectDB()
})