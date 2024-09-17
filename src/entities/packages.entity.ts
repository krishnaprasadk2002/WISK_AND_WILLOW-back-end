import mongoose from "mongoose";

export interface IPackages {
    _id?: string;
    name: String;
    type_of_event: string;
    status?: String;
    image:string
    startingAt: Number;
    packageItems?: IPackageItem[];
    averageRating?: number;
    totalRatings?: number;
    ratings?: { userId: mongoose.Schema.Types.ObjectId, rating: number }[];
  }

  export interface IPackageItem {
    _id: mongoose.Schema.Types.ObjectId,
    itemName: String,
    price: Number,
    status: String, 
  }

