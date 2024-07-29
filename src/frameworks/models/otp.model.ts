import mongoose, { Schema } from "mongoose";
import IOTP from "../../entities/otp.entity";

const OtpSchema:Schema = new Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'Users',required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,default:Date.now,expires:60}
})

const Otp = mongoose.model<IOTP>('OTP',OtpSchema)
export default Otp