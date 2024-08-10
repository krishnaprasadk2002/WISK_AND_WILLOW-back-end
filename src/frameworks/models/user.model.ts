import mongoose, { Schema } from "mongoose";
import IUsers from "../../entities/user.entity";

const UsersSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String },
    password: { type: String },
    is_Verified: { type: Boolean,default:false },
    imageUrl:{type: String},
    status:{type:Boolean,defalut:false},
    isGoogleAuth:{type:Boolean,default:false},
    resetPasswordToken:{type:String,default:null}
  });
  
  const Users = mongoose.model<IUsers>('Users', UsersSchema);
  
  export default Users;