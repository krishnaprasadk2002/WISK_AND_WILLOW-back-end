import express from 'express'
import { GalleryRepository } from '../../respository/gallery.Repository'
import { GalleryUseCase } from '../../usecase/galleryUseCase'
import { GalleryController } from '../../controllers/galleryController'

const galleryRouter = express()
const galleryRepository = new GalleryRepository()
const galleryUseCase = new GalleryUseCase(galleryRepository)
const galleryController = new GalleryController(galleryUseCase)


galleryRouter.post('/addImages',(req,res)=>galleryController.addImage(req,res))
galleryRouter.post('/galleryCategory',(req,res)=> galleryController.addgalleryCategory(req,res))
galleryRouter.get('/getgallerycategory',(req,res)=> galleryController.getgalleryCategory(req,res))
galleryRouter.get('/getgalleryImage',(req,res)=> galleryController.getgalleryImage(req,res))

export default galleryRouter