import mongoose, { Schema, Document } from "mongoose";
import { IBanner } from "../../entities/banner.entity";


const BannerSchema: Schema = new Schema({
  name: { type: String, required: true },
  description:{type:String,required:true},
  image:{type:String,required:true},
  status: { type: Boolean,default:false, required: true}, 
});

const Banner = mongoose.model<IBanner & Document>('Banner', BannerSchema);
export default Banner;
