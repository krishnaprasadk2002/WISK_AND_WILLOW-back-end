import { ObjectId } from "mongoose";

export interface IGallery{
  _id?: ObjectId;
  name: String;
  image: String;
  image_category: String;
}

export interface IGalleryCategory{
  name:string
  image:string
}