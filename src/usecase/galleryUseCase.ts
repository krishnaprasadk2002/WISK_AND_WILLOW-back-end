import { IGallery, IGalleryCategory } from "../entities/gallery.entity";
import { GalleryRepository } from "../respository/gallery.Repository";

export class GalleryUseCase{

    constructor(private galleryRep:GalleryRepository){}

    async addImage(imageData:IGallery):Promise<IGallery>{
        return this.galleryRep.addImageGallery(imageData)
    }

    async addGalleryCategory(categoryData:IGalleryCategory):Promise<IGalleryCategory>{
        return this.galleryRep.addGalleryCategory(categoryData)
    }

    async getGalleryCategory():Promise<IGalleryCategory[]>{
        return this.galleryRep.getgalleryCategory()
    }
    
    async getgalleryImage(page: number, itemsPerPage: number): Promise<{ gallery: IGallery[], totalItems: number }>{
        const gallery = await this.galleryRep.getgalleryImage(page,itemsPerPage)
        const totalItems = await this.galleryRep.getGalleryImageCount()
        return {gallery,totalItems}
    }

    async onSearch(searchTerm:string):Promise<IGallery[]>{
        return await this.galleryRep.onSearch(searchTerm)
    }

    async updateGalleryData(galleryId:string,galleryData:IGallery):Promise<IGallery | null>{
        return await this.galleryRep.updateGalleryData(galleryId,galleryData)
    }

    async deleteGalleryData(galleryId:string):Promise<void>{
        await this.galleryRep.deleteGalleryById(galleryId)
    }

    async getUniqueCategories(): Promise<string[]> {
        return this.galleryRep.findUniqueCategories();
      }

      async getImagesByCategory(category: string): Promise<IGallery[] | null> {
        return this.galleryRep.getImagesByCategory(category);
    }
}