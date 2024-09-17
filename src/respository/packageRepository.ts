import mongoose from "mongoose";
import IFood from "../entities/food.entity";
import { IPackageItem, IPackages } from "../entities/packages.entity";
import Food from "../frameworks/models/food.Model";
import Packages from "../frameworks/models/package.model";
import { IPackageRepository } from "../interfaces/repositories/packageRepository";

export class PackageRepository implements IPackageRepository {

  async addPackages(name: string, type_of_event: string, startingAt: number, image: string): Promise<IPackages> {
    const newPackages = new Packages({ name, type_of_event, startingAt, image })
    return newPackages.save()
  }

  async getPackages(skip: number, limit: number): Promise<IPackages[]> {
    return Packages.find().skip(skip).limit(limit).exec();
  }

  async loadPackage(): Promise<IPackages[]> {
    return await Packages.find()
  }

  async getPackageCount(): Promise<number> {
    return Packages.countDocuments().exec();
  }


  async addPackageFeatures(packageId: string, packageItems: IPackages['packageItems']): Promise<IPackages | null> {
    return Packages.findByIdAndUpdate(
      packageId,
      { $push: { packageItems: { $each: packageItems } } },
      { new: true }
    )
  }

  async getPackageDetails(): Promise<IPackages[]> {
    const packageDetails = Packages.find()
    return packageDetails
  }

  async getPackageDetailsById(id: string): Promise<IPackages | null> {
    const packageDetails = await Packages.findById(id);
    return packageDetails;
  }

  async updateFeature(packageId: string, featureData: IPackageItem): Promise<IPackageItem | null> {
    const updatedPackage = await Packages.findOneAndUpdate(
      { _id: packageId, 'packageItems._id': featureData._id },
      { $set: { 'packageItems.$': featureData } },
      { new: true }
    );

    if (updatedPackage && updatedPackage.packageItems) {
      const updatedFeature = updatedPackage.packageItems.find(item => item._id.toString() === featureData._id.toString());
      return updatedFeature ? (updatedFeature as IPackageItem) : null;
    }
    return null;
  }

  async onSearch(searchTerm: string): Promise<IPackages[]> {
    return await Packages.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { type_of_event: { $regex: searchTerm, $options: 'i' } }
      ]
    })
  }

  async updatePackage(packageId: string, packageData: IPackages): Promise<IPackages | null> {
    return await Packages.findByIdAndUpdate(packageId, packageData, { new: true })
  }

  async deletePackage(packageId: string): Promise<void | null> {
    return await Packages.findByIdAndDelete(packageId)
  }

  async getPackageDetailsByName(packageName: string): Promise<IPackages | null> {
    const packageData = await Packages.findOne({ name: packageName })
    return packageData;
  }

  async getPackageFood(): Promise<IFood[]> {
    return await Food.find()
  }

  async updateStartingAmount(packageId: string, startingAmount: string): Promise<IPackages | null> {
    const updatedPackage = await Packages.findByIdAndUpdate(
      packageId,
      { startingAt: startingAmount },
      { new: true }
    )
    return updatedPackage;
  }

  async addRating(packageId: string, userId: string, rating: number): Promise<IPackages | null> {
    const pkg = await Packages.findById(packageId);
    if (!pkg) {
      throw new Error("Package not found");
    }
    const existingRatingIndex = pkg.ratings?.findIndex(r => r.userId.toString() === userId) ?? -1;

    if (existingRatingIndex !== -1 && pkg.ratings) {
      pkg.ratings[existingRatingIndex].rating = rating;
    } else {
      pkg.ratings?.push({ userId: userId as unknown as mongoose.Schema.Types.ObjectId, rating });

    }

    const totalRatings = pkg.ratings?.length ?? 0;
    const sumRatings = pkg.ratings?.reduce((sum, r) => sum + r.rating, 0) ?? 0;
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    pkg.averageRating = averageRating;
    pkg.totalRatings = totalRatings;

    return await pkg.save();
  }

}
