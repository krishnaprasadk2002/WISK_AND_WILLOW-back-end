import { IPackages } from "../entities/packages.entity";
import Packages from "../frameworks/models/package.model";

export class PackageRepository{

    async addPackages(name:string,type_of_event:string,startingAt:number):Promise<IPackages>{
        const newPackages = new Packages({name,type_of_event,startingAt})
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
}