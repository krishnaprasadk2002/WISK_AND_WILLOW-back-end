import IFood from "../../entities/food.entity";
import { IPackageItem, IPackages } from "../../entities/packages.entity";

export interface IPackageRepository{
    addPackages(name: string, type_of_event: string, startingAt: number, image: string): Promise<IPackages>
    getPackages(skip: number, limit: number): Promise<IPackages[]> 
    loadPackage():Promise<IPackages[]>
    getPackageCount(): Promise<number>
    addPackageFeatures(packageId: string, packageItems: IPackages['packageItems']): Promise<IPackages | null>
    getPackageDetails(): Promise<IPackages[]>
    getPackageDetailsById(id: string): Promise<IPackages | null>
    updateFeature(packageId: string, featureData: IPackageItem): Promise<IPackageItem | null>
    onSearch(searchTerm: string): Promise<IPackages[]>
    updatePackage(packageId: string, packageData: IPackages): Promise<IPackages | null>
    deletePackage(packageId:string):Promise<void | null>
    getPackageDetailsByName(packageName: string): Promise<IPackages | null>
    getPackageFood():Promise<IFood[]>
    updateStartingAmount(packageId: string, startingAmount: string): Promise<IPackages | null>
    addRating(packageId: string, userId: string, rating: number): Promise<IPackages | null>
}