import { ObjectId } from "mongoose";

export interface IPackages {
    _id: ObjectId;
    name: String;
    type_of_event: string;
    status: String;
    startingAt: Number;
    packageItems?: IPackageItem[];
  }

  export interface IPackageItem {
    itemName: string;
    price: number;
    status: boolean;
  }