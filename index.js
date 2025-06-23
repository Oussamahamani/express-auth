import express from 'express'
import 'dotenv/config'

import connectDB from './db.js'

const app = express()

const port = 8080

app.use(express.json())



app.listen(port, () => {
    console.log('Listening on port: ', port)
    connectDB()
})