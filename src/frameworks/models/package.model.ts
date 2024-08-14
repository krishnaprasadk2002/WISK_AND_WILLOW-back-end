import mongoose, { Schema, ObjectId } from 'mongoose';
import { IPackageItem, IPackages } from '../../entities/packages.entity';

const PackageItemSchema = new Schema<IPackageItem>({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true }
});

const PackageSchema = new Schema<IPackages>({
  name: { type: String, required: true },
  type_of_event: { type: String, required: true },
  startingAt: { type: Number, required: true },
  status: { type: String },
  image: { type: String },
  packageItems: [PackageItemSchema]
});
  
  export const Packages = mongoose.model<IPackages>('Package', PackageSchema);
  export default Packages