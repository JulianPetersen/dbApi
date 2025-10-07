import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';


const userSchema = new Schema({
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    roles:[{
        ref: "Role",
        type: Schema.Types.ObjectId
    }],

},
{
    timestamps:true,
    versionKey:false
})

userSchema.statics.encryptPassword = async (password)=> {
   const salt = await bcrypt.genSalt(10)
   return bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password, recivedPassword)
}

export default model('User', userSchema)