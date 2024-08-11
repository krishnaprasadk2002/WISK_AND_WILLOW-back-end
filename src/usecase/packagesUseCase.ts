import { IPackageItem, IPackages } from "../entities/packages.entity";
import { PackageRepository } from "../respository/packageRepository";

export class PackageUseCase{
    constructor(private packageRep:PackageRepository){}

async addPackage(name:string,type_of_event:string,startingAt:number):Promise<IPackages>{
    return this.packageRep.addPackages(name,type_of_event,startingAt)
}

async getPackages():Promise<IPackages[]>{
    return this.packageRep.getPackages()
}

async addPackageFeature(packageId: string, packageItems: IPackageItem[]): Promise<IPackages | null> {
    return this.packageRep.addPackageFeatures(packageId, packageItems);
  }
}