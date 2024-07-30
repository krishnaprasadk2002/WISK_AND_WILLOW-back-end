import { Document, ObjectId } from "mongoose";

export interface IUsers extends Document {
    _id: ObjectId;
    name: String;
    email: String;
    mobile: String;
    password: String;
    is_Verified: Boolean;
  }

  export default IUsers