import { IPackageItem, IPackages } from "../entities/packages.entity";
import Packages from "../frameworks/models/package.model";

export class PackageRepository{

    async addPackages(name:string,type_of_event:string,startingAt:number,image:string):Promise<IPackages>{
        const newPackages = new Packages({name,type_of_event,startingAt,image})
        return newPackages.save()
    }

    async getPackages():Promise<IPackages[]>{
        return Packages.find({status:{$ne:true}})
    }

    async addPackageFeatures(packageId: string, packageItems: IPackages['packageItems']): Promise<IPackages | null> {
        return Packages.findByIdAndUpdate(
          packageId,
          { $push: { packageItems: { $each: packageItems } } },
          { new: true }
        )
      }

      async getPackageDetails():Promise<IPackages[]>{
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
    
    
  }
