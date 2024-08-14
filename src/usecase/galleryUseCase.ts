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
    
    async getgalleryImage():Promise<IGallery[]>{
        return this.galleryRep.getgalleryImage()
    }
}