require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const todoRouter = require('./Routes/TodoRoutes')

const cors = require('cors')
const corsOptions ={
    origin:"*",
    credentials:true,
    'method':"GET,HEAD,PATCH,PUT,POST,DELETE",
    "preflightContinue":false
}


mongoose.connect(process.env.DATA_URL,(err)=>{
    if(err){
        console.log(err)
    }else console.log('connected')
})

app.use(cors(corsOptions))

app.use(express.json())

app.use('/todo',todoRouter)

app.get('/',(req,res)=>{
    res.json({message:'hello json'})
})

app.listen(8080,()=> console.log("listenning"))