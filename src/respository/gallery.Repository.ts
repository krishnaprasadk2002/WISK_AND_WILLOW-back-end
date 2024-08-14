import { IGallery, IGalleryCategory } from "../entities/gallery.entity";
import Gallery from "../frameworks/models/gallery.model";
import GalleryCategory from "../frameworks/models/galleryCategorymodel";

export class GalleryRepository{
    constructor(){}

    async addImageGallery(imageData:IGallery):Promise<IGallery>{
        const newImage = new Gallery(imageData)
        await newImage.save() 
        return newImage
    }

    async addGalleryCategory(categoryData: IGalleryCategory): Promise<IGalleryCategory> {
        const newCategory = new GalleryCategory(categoryData); 
        await newCategory.save();
        return newCategory;
      }

      async getgalleryCategory():Promise<IGalleryCategory[]>{
        return await GalleryCategory.find()
      }

      async getgalleryImage():Promise<IGallery[]>{
        return await Gallery.find()
      }
      
}