import { Request, Response } from "express";
import { PackageUseCase } from "../usecase/packagesUseCase";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import { IPackages } from "../entities/packages.entity";
import { HttpStatusCode } from "../enums/httpStatusCodes";

export class PackageController {
    constructor(private packageUseCase: PackageUseCase) { }

    async addPackage(req: Request, res: Response): Promise<void> {
        try {
            const { name, type_of_event, startingAmount, image } = req.body

            const imageUrl = await uploadCloudinary(image)
            const newPackage = await this.packageUseCase.addPackage(name, type_of_event, startingAmount, imageUrl);
            res.status(HttpStatusCode.CREATED).json(newPackage);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error adding package', error });
        }
    }

    async getPackages(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;
            const packagesData = await this.packageUseCase.getPackages(page, itemsPerPage);
            res.status(HttpStatusCode.OK).json(packagesData);
        } catch (error) {
            console.error('Error fetching packages:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching packages', error });
        }
    }

    async loadPackage(req: Request, res: Response) {
        try {
            const packageData = await this.packageUseCase.loadPackage();
            res.status(HttpStatusCode.OK).json(packageData);
        } catch (error) {
            console.error('Error fetching packages:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching packages', error });
        }
    }



    async addPackageFeatures(req: Request, res: Response) {

        const packageId = req.params.packageId;
        const { packageItems } = req.body;
        try {
            if (!Array.isArray(packageItems)) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid package items format' });
            }
            const upadtePackage = await this.packageUseCase.addPackageFeature(packageId, packageItems)
            if (!upadtePackage) {
                return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Package not found' });
            }
            res.status(HttpStatusCode.OK).json(upadtePackage);
        } catch (error) {
            console.error('Error adding package features:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async getPackageFeatures(req: Request, res: Response) {
        try {
            const packageDetails = await this.packageUseCase.getPackageFeatureDetails()
            res.json(packageDetails)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error Fething packageDetails', error });
        }
    }

    async getpackageDetailsById(req: Request, res: Response) {

        const id = req.params.packageId;

        try {
            const packageDetails = await this.packageUseCase.getPackageDetailsById(id)
            res.status(HttpStatusCode.OK).json(packageDetails)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error Fething packageDetails', error });
        }

    }

    async updateFeature(req: Request, res: Response): Promise<void> {
        try {
            const { packageId, featureData } = req.body;

            if (!packageId || !featureData || !featureData._id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Invalid input or missing feature ID' });
                return;
            }

            const updatedFeature = await this.packageUseCase.editPacakgeFeatures(packageId, featureData);
            if (updatedFeature) {
                res.status(HttpStatusCode.OK).json(updatedFeature);
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Feature not found or update failed' });
            }
        } catch (error) {
            console.error('Error updating feature:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    async onSearch(req: Request, res: Response) {
        const searchTerm = req.query.searchTerm as string;
        try {
            const searchResult = await this.packageUseCase.onSearch(searchTerm);
            res.json(searchResult);
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error searching event' });
        }
    }

    async editPackage(req: Request, res: Response) {
        try {
            const packageId = req.body.packageId
            const { name, type_of_event, startingAmount, image } = req.body.packageData

            const imageUrl = await uploadCloudinary(image)

            const packageData: IPackages = {
                name,
                type_of_event,
                startingAt: startingAmount,
                image: imageUrl
            };

            const updatedPackage = await this.packageUseCase.updatePackage(packageId, packageData)
            res.status(HttpStatusCode.OK).json(updatedPackage)

        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update package', error });
        }
    }

    async deletePacakge(req: Request, res: Response): Promise<void> {
        try {
            const packageId = req.query.packageId as string;

            if (!packageId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Package ID is required' });
                return;
            }

            const result = await this.packageUseCase.deletePackage(packageId);

            if (result) {
                res.status(HttpStatusCode.OK).json({ message: 'Package deleted successfully' });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Package not found' });
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }

    async getPackageDetailsByName(req: Request, res: Response) {
        const packageName = req.query.name as string
        try {
            const result = await this.packageUseCase.getPackageDetailsByName(packageName)
            res.status(HttpStatusCode.OK).json(result)
        } catch (error) {
            console.error('Error fetching packages', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }

    async getPackageFood(req: Request, res: Response) {
        try {
            const result = await this.packageUseCase.getPackageFood()
            res.status(HttpStatusCode.OK).json(result)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }

    async updateStartingAmount(req:Request,res:Response){
        const { packageId, startingAmount } = req.body;
        try {
            const result = await this.packageUseCase.updateStartingAmount(packageId,startingAmount)
            res.status(HttpStatusCode.OK).json({ message: 'Package updated successfully', data: result })
        } catch (error) {
            console.error('Error in PackagesController.updateStartingAmount:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json( error);
        }
    }
}
