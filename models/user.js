import mongoose from 'mongoose'

const {Schema,model}=mongoose;

const userSchema=new Schema({
    name:String,
    email:String,
    password:String
})

const UserModel=model('User',userSchema);