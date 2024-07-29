import mongoose from "mongoose";

export interface IOTP extends Document {
    userId:mongoose.Types.ObjectId;
    otp:string
    createdAt:Date
}

export default IOTP