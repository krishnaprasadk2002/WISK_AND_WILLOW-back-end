import { Document, ObjectId } from "mongoose";

export interface IUsers {
    _id: ObjectId;
    name: string;
    email: string;
    mobile: string;
    password: string;
    is_Verified: Boolean;
    imageUrl?:string;
    status:Boolean;
  }

  export default IUsers