import { Request, Response } from "express";
import { PackageUseCase } from "../usecase/packagesUseCase";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import { IPackages } from "../entities/packages.entity";

export class PackageController {
    constructor(private packageUseCase: PackageUseCase) { }

    async addPackage(req: Request, res: Response): Promise<void> {
        try {
            const { name, type_of_event, startingAmount, image } = req.body
            console.log(req.body);
            
            const imageUrl = await uploadCloudinary(image)
            const newPackage = await this.packageUseCase.addPackage(name, type_of_event, startingAmount, imageUrl);
            res.status(201).json(newPackage);
        } catch (error) {
            res.status(500).json({ message: 'Error adding package', error });
        }
    }

    async getPackages(req: Request, res: Response): Promise<void> {
        try {
          const page = parseInt(req.query.page as string, 10) || 1;
          const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;
          const packagesData = await this.packageUseCase.getPackages(page, itemsPerPage);
          res.status(200).json(packagesData);
        } catch (error) {
          console.error('Error fetching packages:', error);
          res.status(500).json({ message: 'Error fetching packages', error });
        }
      }

      async loadPackage(req: Request, res: Response) {
        try {
          const packageData = await this.packageUseCase.loadPackage();
          console.log('Fetched package data:', packageData); 
          res.status(200).json(packageData);
        } catch (error) {
          console.error('Error fetching packages:', error);
          res.status(500).json({ message: 'Error fetching packages', error });
        }
      }
      
      

    async addPackageFeatures(req: Request, res: Response) {

        const packageId = req.params.packageId;
        const { packageItems } = req.body;
        try {
            if (!Array.isArray(packageItems)) {
                return res.status(400).json({ error: 'Invalid package items format' });
            }
            const upadtePackage = await this.packageUseCase.addPackageFeature(packageId, packageItems)
            if (!upadtePackage) {
                return res.status(404).json({ error: 'Package not found' });
            }
            res.status(200).json(upadtePackage);
        } catch (error) {
            console.error('Error adding package features:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getPackageFeatures(req: Request, res: Response) {
        try {
            const packageDetails = await this.packageUseCase.getPackageFeatureDetails()
            res.json(packageDetails)
        } catch (error) {
            res.status(500).json({ message: 'Error Fething packageDetails', error });
        }
    }

    async getpackageDetailsById(req: Request, res: Response) {

        const id = req.params.packageId;
        console.log("package Id", id);
        try {
            const packageDetails = await this.packageUseCase.getPackageDetailsById(id)
            res.status(200).json(packageDetails)
        } catch (error) {
            res.status(500).json({ message: 'Error Fething packageDetails', error });
        }

    }

    async updateFeature(req: Request, res: Response): Promise<void> {
        try {
            const { packageId, featureData } = req.body;
            console.log(`Package ID: ${packageId}`);
            console.log(`Feature Data:`, featureData, "data");
    
            if (!packageId || !featureData || !featureData._id) {
                res.status(400).json({ message: 'Invalid input or missing feature ID' });
                return;
            }
    
            const updatedFeature = await this.packageUseCase.editPacakgeFeatures(packageId, featureData);
            if (updatedFeature) {
                res.status(200).json(updatedFeature);
            } else {
                res.status(404).json({ message: 'Feature not found or update failed' });
            }
        } catch (error) {
            console.error('Error updating feature:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    async onSearch(req: Request, res: Response) {
        const searchTerm = req.query.searchTerm as string;
        try {
          const searchResult = await this.packageUseCase.onSearch(searchTerm);
          res.json(searchResult);
        } catch (error) {
          console.error('Error searching users:', error);
          res.status(500).json({ message: 'Error searching event' });
        }
      }

      async editPackage(req:Request,res:Response){
        try {
            const packageId= req.body.packageId
            const {name,type_of_event,startingAmount,image} = req.body.packageData
            console.log(packageId);
            
            console.log(name,type_of_event,startingAmount,image);
            

            const imageUrl =await uploadCloudinary(image)
           
            const packageData:IPackages = {
                name,
                type_of_event,
                startingAt:startingAmount,
                image:imageUrl
              };
    
              const updatedPackage = await this.packageUseCase.updatePackage(packageId,packageData)
              res.status(200).json(updatedPackage)
    
        } catch (error) {
            res.status(500).json({message: 'Failed to update package',error});
        }
      }

      async deletePacakge(req: Request, res: Response): Promise<void> {
        try {
            const packageId = req.query.packageId as string;
    
            if (!packageId) {
                res.status(400).json({ message: 'Package ID is required' });
                return;
            }
    
            const result = await this.packageUseCase.deletePackage(packageId);
            
            if (result) {
                res.status(200).json({ message: 'Package deleted successfully' });
            } else {
                res.status(404).json({ message: 'Package not found' });
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    

}