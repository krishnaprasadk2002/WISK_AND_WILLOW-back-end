import express from 'express';
import { BannerRepository } from "../../respository/bannerRepository";
import { BannerUseCase } from "../../usecase/bannerUseCase";
import { BannerController } from "../../controllers/bannerController";

const bannerRouter = express()
const bannerRepository = new BannerRepository()
const bannerUseCase = new BannerUseCase(bannerRepository)
const bannerController = new BannerController(bannerUseCase)

bannerRouter.post('/addbanner',(req,res)=>bannerController.addBanner(req,res))
bannerRouter.get('/getbanner',(req,res)=>bannerController.getBanners(req,res))
bannerRouter.post('/updatebannerstatus',(req,res)=>bannerController.updateBannerStatus(req,res))
bannerRouter.get('/search',(req,res)=>bannerController.onSearch(req,res))



export default bannerRouter