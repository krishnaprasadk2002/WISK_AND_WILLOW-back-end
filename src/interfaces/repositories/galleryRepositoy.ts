import { IGallery, IGalleryCategory } from "../../entities/gallery.entity";

export interface IGalleryRepository{
    addImageGallery(imageData:IGallery):Promise<IGallery>
    addGalleryCategory(categoryData: IGalleryCategory): Promise<IGalleryCategory>
    findCategoryByName(name: string): Promise<IGalleryCategory | null>
    getgalleryCategory():Promise<IGalleryCategory[]>
    getgalleryImage(page: number, itemsPerPage: number):Promise<IGallery[]>
    getGalleryImageCount(): Promise<number> 
    onSearch(searchTerm:string):Promise<IGallery[]>
    updateGalleryData(galleryId:string,galleryData:IGallery):Promise<IGallery | null>
    deleteGalleryById(galleryId: string): Promise<void>
    GetGalleryCategoryData(): Promise<IGalleryCategory[]>
    getGalleryImageData(name: string): Promise<IGallery[]>
}