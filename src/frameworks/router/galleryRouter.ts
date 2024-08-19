import express from 'express'
import { GalleryRepository } from '../../respository/gallery.Repository'
import { GalleryUseCase } from '../../usecase/galleryUseCase'
import { GalleryController } from '../../controllers/galleryController'
import { adminAuthMiddleware } from '../middlewares/adminAuthentication'

const galleryRouter = express()
const galleryRepository = new GalleryRepository()
const galleryUseCase = new GalleryUseCase(galleryRepository)
const galleryController = new GalleryController(galleryUseCase)


galleryRouter.post('/addImages',(req,res)=>galleryController.addImage(req,res))
galleryRouter.post('/galleryCategory',(req,res)=> galleryController.addgalleryCategory(req,res))
galleryRouter.get('/getgallerycategory',adminAuthMiddleware,(req,res)=> galleryController.getgalleryCategory(req,res))
galleryRouter.get('/getgalleryImage',adminAuthMiddleware,(req,res)=> galleryController.getgalleryImage(req,res))
galleryRouter.get('/search', adminAuthMiddleware,(req, res) => galleryController.onSearch(req, res));
galleryRouter.put('/editgalleryimage',(req, res) => galleryController.editGalleryImage(req, res));
galleryRouter.delete('/deleteGalleryData',(req, res) => galleryController.deleteGalleryData(req, res))

export default galleryRouter