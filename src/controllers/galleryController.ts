import { Request, Response } from "express";
import { GalleryUseCase } from "../usecase/galleryUseCase";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import Gallery from "../frameworks/models/gallery.model";

export class GalleryController{
    constructor(private galleryUseCase:GalleryUseCase){}

    async addImage(req: Request, res: Response) {
        const { name, image, category } = req.body;

        if (!name || !image || !category) {
          return res.status(400).json({ message: 'Name, image, and category are required.' });
        }
      
        try {
          const imageUrl = await uploadCloudinary(image);
      
          const galleryData = {
            name,
            image: imageUrl,
            image_category: category
          };
          const savedImage = await this.galleryUseCase.addImage(galleryData);
      
          res.status(200).json(savedImage);
        } catch (error) {
          console.error('Error adding image:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

    async addgalleryCategory(req: Request, res: Response) {
        const { categoryName } = req.body;
        console.log("categoryname", categoryName);
        try {
          const savedGalleryCategory = await this.galleryUseCase.addGalleryCategory({ name: categoryName });
          res.status(200).json(savedGalleryCategory);
        } catch (error) {
          console.error('Error saving category', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

      async getgalleryCategory(req:Request,res:Response){
        try {
            const categoryData = await this.galleryUseCase.getGalleryCategory()
            res.status(200).json(categoryData)
        } catch (error) {
            console.error('Error Fecthing category', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }

      async getgalleryImage(req:Request,res:Response){
        try {
            const GalleryData = await this.galleryUseCase.getgalleryImage()
            res.status(200).json(GalleryData)
        } catch (error) {
            console.error('Error Fecthing image', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
      
}