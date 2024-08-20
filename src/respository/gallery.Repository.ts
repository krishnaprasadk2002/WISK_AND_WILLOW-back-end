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

      async getgalleryImage(page: number, itemsPerPage: number):Promise<IGallery[]>{
        const skip = (page - 1) * itemsPerPage;
        return await Gallery.find()
            .skip(skip)
            .limit(itemsPerPage) as IGallery[];
      }

      async getGalleryImageCount(): Promise<number> {
        return await Gallery.countDocuments();
    }

      async onSearch(searchTerm:string):Promise<IGallery[]>{
        return await Gallery.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { image_category: { $regex: searchTerm, $options: 'i' } },
            ]
        })
    }

    async updateGalleryData(galleryId:string,galleryData:IGallery):Promise<IGallery | null>{
      return await Gallery.findByIdAndUpdate(galleryId,galleryData,{new:true})
    }
      
    async deleteGalleryById(galleryId: string): Promise<void> {
      await Gallery.findByIdAndDelete(galleryId);
    }

    async findUniqueCategories(): Promise<string[]> {
      const categories = await Gallery.distinct('image_category');
      return categories.map(category => category.toString());
    }

    async getImagesByCategory(category: string): Promise<IGallery[]| null > {
      return Gallery.findOne({ image_category: category });
  }
  
  }