import { IPackageItem, IPackages } from "../entities/packages.entity";
import { PackageRepository } from "../respository/packageRepository";

export class PackageUseCase{
    constructor(private packageRep:PackageRepository){}

async addPackage(name:string,type_of_event:string,startingAt:number,image:string):Promise<IPackages>{
    return this.packageRep.addPackages(name,type_of_event,startingAt,image)
}

async getPackages():Promise<IPackages[]>{
    return this.packageRep.getPackages()
}

async addPackageFeature(packageId: string, packageItems: IPackageItem[]): Promise<IPackages | null> {
    return this.packageRep.addPackageFeatures(packageId, packageItems);
  }

  async getPackageFeatureDetails():Promise<IPackages[]>{
    return this.packageRep.getPackageDetails()
  }

  async getPackageDetailsById(id:string):Promise<IPackages | null>{
    return this.packageRep.getPackageDetailsById(id)
  }

  async editPacakgeFeatures(packageId:string,featureData: IPackageItem): Promise<IPackageItem | null> {
    return await this.packageRep.updateFeature(packageId,featureData)
  }

}