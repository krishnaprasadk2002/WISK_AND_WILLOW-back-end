import IOTP from './../entities/otp.entity';
import Otp from "../frameworks/models/otp.model";
import mongoose from 'mongoose';

export class OtpRepository{
   async createOtp(userId:string,otp:string): Promise<IOTP>{
   const otpEntry = new Otp({userId,otp})
   return await otpEntry.save()
   }

   async findOtp(userId:mongoose.Types.ObjectId,otp:string): Promise<IOTP | null>{
    return await Otp.findOne({userId,otp})
   }

   async deleteOtp(userId:mongoose.Types.ObjectId):Promise<void>{
    await Otp.deleteMany({userId})
   }
}