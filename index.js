import express from 'express'
import 'dotenv/config'

import connectDB from './db.js'
import User from "./models/User.js"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const app = express()

const port = 8080

app.use(express.json())

app.post("/api/signup",async(req,res)=>{
    try {
         console.log(req.body)
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(req.body.password,salt)
        
    req.body.password = hashedPassword
    let newUser = await User.create(req.body)
      let payload = {
            email:newUser.email,
            id:newUser._id,
            userName:newUser.userName
        }
    const token = jwt.sign(payload,process.env.secret,{expiresIn:"3650d"})
        res.send(token)
    } catch (error) {
        res.json({error:error.message}).status(401)
    }
   
})

app.post("/api/signin",async (req,res)=>{

    try {
        
        let user = await User.findOne({
            email:req.body.email
        })

        console.log(user)
        if(!user){
            throw Error("user does not exist")
        }
        let password = req.body.password
        let isPasswordValid = await bcrypt.compare(password,user.password)
        
        if(!isPasswordValid){
         throw Error("password is incorrect")
        }


        let payload = {
            email:user.email,
            id:user._id,
            userName:user.userName
        }
        const token = jwt.sign(payload,process.env.secret,{expiresIn:"3650d"})
        res.send(token)
    } catch (error) {
        res.status(401).json({error:error.message})
    }
})

const checkIfAuthenticated= (req,res,next)=>{
    try {
        
        let token = req.header("Authorization")
        token = token.replace("Bearer ","")
  let payload= jwt.verify(token,process.env.secret)
        // console.log("🚀 ~ app.get ~ token:", payload)
        req.payload = payload
        next()
    } catch (error) {
        res.send("you need to log in")
    }

}

app.get("/users",checkIfAuthenticated ,async(req,res)=>{
  
  
        let users = await User.find({})
        res.send(users)
        
  
})

app.get("/users/:id",checkIfAuthenticated,async(req,res)=>{
    console.log(req.payload.id)
    let user = await User.findById(req.params.id)
    if(user._id.toString() !== req.payload.id){
        res.send("you are not "+ user.userName)
        return
    }
    res.send(user)
})

app.listen(port, () => {
    console.log('Listening on port: ', port)
    connectDB()
})