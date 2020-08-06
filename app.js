import express from 'express';
import mongoose from 'mongoose';
import './models/auth.js';
import './models/post.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import dotenv from 'dotenv';

const app=express()

dotenv.config()

mongoose.connect(process.env.MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('connected',()=>console.log('Connected to MongoDB!'))
mongoose.connection.on('error',err=>console.log('Error While Connecting to MongoDB',err))

app.use(express.json())
app.use(authRouter)
app.use(postRouter)

const {PORT}=process.env

app.listen(PORT,()=>console.log(`Server is Running on ${PORT} ... `))