import mongoose, { Schema } from "mongoose";
import IUsers from "../../entities/user.entity";

const UsersSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    is_Verified: { type: Boolean,default:false },
    status:{type:Boolean,defalut:true}
  });
  
  const Users = mongoose.model<IUsers>('Users', UsersSchema);
  
  export default Users;