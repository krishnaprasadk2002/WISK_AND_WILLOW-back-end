import { IPackageItem, IPackages } from "../entities/packages.entity";
import IFood from "../entities/food.entity";
import { IPackageRepository } from "../interfaces/repositories/packageRepository";

export class PackageUseCase{
    constructor(private packageRep:IPackageRepository){}

async addPackage(name:string,type_of_event:string,startingAt:number,image:string):Promise<IPackages>{
    return this.packageRep.addPackages(name,type_of_event,startingAt,image)
}

async getPackages(page: number, itemsPerPage: number): Promise<{ packages: IPackages[], totalItems: number }> {
  const skip = (page - 1) * itemsPerPage;
  const packages = await this.packageRep.getPackages(skip, itemsPerPage);
  const totalItems = await this.packageRep.getPackageCount();
  return { packages, totalItems };
}

async loadPackage():Promise<IPackages[]>{
return this.packageRep.loadPackage()
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

  async onSearch(searchTerm:string):Promise<IPackages[]>{
    return await this.packageRep.onSearch(searchTerm)
  }

  async updatePackage(packageId:string,packageData:IPackages):Promise<IPackages | null>{
    return await this.packageRep.updatePackage(packageId,packageData)
  }

  async deletePackage(packageId:string):Promise<void | null>{
    return await this.packageRep.deletePackage(packageId)
  }

  async getPackageDetailsByName(packageName:string):Promise<IPackages | null>{
    return await this.packageRep.getPackageDetailsByName(packageName)
  }

  async getPackageFood():Promise<IFood[]>{
    return await this.packageRep.getPackageFood()
  }

  async updateStartingAmount(packageId:string,startingAmount:string):Promise<IPackages | null>{
    const updatedPackage = await this.packageRep.updateStartingAmount(packageId, startingAmount)
    return updatedPackage
  }

  async addRatingInPackage(packageId: string, userId: string, rating: number) {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    return await this.packageRep.addRating(packageId, userId, rating);
  }

}