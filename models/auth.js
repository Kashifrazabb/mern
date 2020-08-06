import mongoose from 'mongoose'

const {Schema,model}=mongoose;

const authSchema=new Schema({
    name:{type:String,required:true,trim:true,lowercase:true},
    email:{type:String,required:true,trim:true,lowercase:true},
    password:{type:String,required:true}
})

model('auth',authSchema);