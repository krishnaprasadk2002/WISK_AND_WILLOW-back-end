import express from 'express'
import Packages from '../models/package.model'
import { PackageRepository } from '../../respository/packageRepository'
import { PackageUseCase } from '../../usecase/packagesUseCase'
import { PackageController } from '../../controllers/packageController'
import { adminAuthMiddleware } from '../middlewares/adminAuthentication'

const packageRouter = express()
const packageRepository = new PackageRepository()
const packageUseCase = new PackageUseCase(packageRepository)
const packageController = new PackageController(packageUseCase)

packageRouter.post('/addpackage',(req,res)=>packageController.addPackage(req,res))
packageRouter.get('/getpackages',(req,res)=>packageController.getPackages(req,res))
packageRouter.post('/addpackagefeatures/:packageId',(req,res)=> packageController.addPackageFeatures(req,res));
packageRouter.get('/getpackagebyid/:packageId',adminAuthMiddleware,(req,res)=> packageController.getpackageDetailsById(req,res));
packageRouter.put('/editpackagefeature',(req,res)=>packageController.updateFeature(req,res))
packageRouter.get('/search',adminAuthMiddleware,(req,res)=>packageController.onSearch(req,res))

export default packageRouter
