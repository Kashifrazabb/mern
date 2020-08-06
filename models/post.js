import mongoose from 'mongoose';

const {Schema,model}=mongoose;

const postSchema = new Schema({
    title:{type:String,required:true,trim:true},
    body:{type:String,required:true},
    img:{type:String,default:'no photo'},
    currentUser:{type:Schema.Types.ObjectId,ref:'auth'}
})

model('post',postSchema)