import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';


const managmentSchema = new Schema({
    userId:{
        ref: "User",
        type: Schema.Types.ObjectId
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,

    },
    totalHours:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
},
{ 
    timestamps:true,
    versionKey:false
})


export default model('Managment', managmentSchema)