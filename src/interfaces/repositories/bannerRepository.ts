import IBanner from "../../entities/banner.entity";

export interface IBannerRepository{
    addBanner(bannerData:IBanner):Promise<IBanner>
    getBanners(page:number,itemsPerPage:number):Promise<IBanner[]>
    getBannerImageCount():Promise<number>
    updateBannerStatus(bannerId: string, status: boolean): Promise<IBanner | null>
    searchBanner(searchTerm:string):Promise<IBanner[]>
}