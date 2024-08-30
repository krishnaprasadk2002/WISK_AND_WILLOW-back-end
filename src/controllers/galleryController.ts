import { Request, Response } from "express";
import { GalleryUseCase } from "../usecase/galleryUseCase";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import { HttpStatusCode } from "../enums/httpStatusCodes";

export class GalleryController {
  constructor(private galleryUseCase: GalleryUseCase) { }

  async addImage(req: Request, res: Response) {
    const { name, image, category } = req.body;

    if (!name || !image || !category) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Name, image, and category are required.' });
    }

    try {
      const imageUrl = await uploadCloudinary(image);

      const galleryData = {
        name,
        image: imageUrl,
        image_category: category
      };
      const savedImage = await this.galleryUseCase.addImage(galleryData);

      res.status(HttpStatusCode.OK).json(savedImage);
    } catch (error) {
      console.error('Error adding image:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  async addgalleryCategory(req: Request, res: Response) {
    const { categoryName, categoryImage } = req.body;
  
    try {

      const existingCategory = await this.galleryUseCase.findCategoryByName(categoryName);
  
      if (existingCategory) {
        return res.status(HttpStatusCode.CONFLICT).json({ message: 'Category already exists' });
      }

      const imageUrl = await uploadCloudinary(categoryImage); 
      const savedGalleryCategory = await this.galleryUseCase.addGalleryCategory({ name: categoryName, image: imageUrl });
      
      res.status(HttpStatusCode.OK).json(savedGalleryCategory);
    } catch (error) {
      console.error('Error saving category', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
  
  

  async getgalleryCategory(req: Request, res: Response) {
    try {
      const categoryData = await this.galleryUseCase.getGalleryCategory()
      res.status(HttpStatusCode.OK).json(categoryData)
    } catch (error) {
      console.error('Error Fecthing category', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  async getgalleryImage(req: Request, res: Response) {
    try {

      const page = parseInt(req.query.page as string, 10) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;

      const GalleryData = await this.galleryUseCase.getgalleryImage(page, itemsPerPage)
      res.status(HttpStatusCode.OK).json(GalleryData)
    } catch (error) {
      console.error('Error Fecthing image', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  async onSearch(req: Request, res: Response) {
    const searchTerm = req.query.searchTerm as string;
    try {
      const searchResult = await this.galleryUseCase.onSearch(searchTerm);
      res.json(searchResult);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error searching gallery' });
    }
  }

  async editGalleryImage(req: Request, res: Response) {
    try {
      const { galleryId } = req.body
      const { name , image , category } = req.body.galleryData
        const imageUrl = await uploadCloudinary(image)
        
      const galleryData = {
        name,
        image:imageUrl,
        image_category:category
      }
      const updatedGallery = await this.galleryUseCase.updateGalleryData(galleryId, galleryData)
      if (!updatedGallery) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Gallery item not found' });
      }
      return res.status(HttpStatusCode.OK).json(updatedGallery);
    } catch (error) {
      console.error('Error updating gallery:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update gallery item' });
    }
  }

  async deleteGalleryData(req: Request, res: Response): Promise<void> {
    const galleryId = req.query.id;

    try {
      await this.galleryUseCase.deleteGalleryData(galleryId as string);
      res.status(HttpStatusCode.OK).send({ message: 'Gallery deleted successfully' });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Error deleting gallery', error });
    }
  }

  async getGalleryCategoryData(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = await this.galleryUseCase.galleryCategoryData();
      res.status(HttpStatusCode.OK).json(categoryData);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Gallery category data fetching error', error });
    }
  }
  
  async getgalleryImageByName(req: Request, res: Response) {
    const name = req.query.name as string;
    try {
      const galleryImage = await this.galleryUseCase.getGalleryImages(name);
      res.status(HttpStatusCode.OK).json(galleryImage);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Gallery Image data fetching error', error });
    }
  }
  
}