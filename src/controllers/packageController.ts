import { Request, Response } from "express";
import { IPackages } from "../entities/packages.entity";
import { PackageUseCase } from "../usecase/packagesUseCase";

export class PackageController {
    constructor(private packageUseCase: PackageUseCase) { }

    async addPackage(req: Request, res: Response): Promise<void> {
        try {
            const { name, type_of_event, startingAmount } = req.body;
            const newPackage = await this.packageUseCase.addPackage(name, type_of_event, startingAmount);
            res.status(201).json(newPackage);
        } catch (error) {
            res.status(500).json({ message: 'Error adding package', error });
        }
    }

    async getPackages(req: Request, res: Response) {
        try {
            const PackagesData = await this.packageUseCase.getPackages()
            res.status(200).json(PackagesData)
        } catch (error) {
            res.status(500).json({ message: 'Error Fething package', error });
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
}