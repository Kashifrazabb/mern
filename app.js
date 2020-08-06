import express from 'express';
import './models/user.js';
import mongoose from 'mongoose';
import router from './routes/auth.js';
import dotenv from 'dotenv';

dotenv.config()

mongoose.connect(process.env.MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('connected',()=>console.log('Connected to MongoDB!'))
mongoose.connection.on('error',err=>console.log('Error While Connecting to MongoDB',err))

const app=express()

app.use(express.json())
app.use(router)

const {PORT}=process.env

app.listen(PORT,()=>console.log(`Server is Running on ${PORT} ... `))