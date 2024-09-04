import IBanner from "../entities/banner.entity";
import { BannerRepository } from "../respository/bannerRepository";

export class BannerUseCase{
    constructor(private bannerRep:BannerRepository){}

    async addBanner(bannerData:IBanner):Promise<IBanner>{
        return await this.bannerRep.addBanner(bannerData)
    }

    async getBannerImage(page:number,itemsPerPage:number):Promise<{banner:IBanner[],totalItems:number}>{
        const banner = await this.bannerRep.getBanners(page,itemsPerPage)
        const totalItems = await this.bannerRep.getBannerImageCount()
        return {banner,totalItems}
    }

  async updateBannerStatus(bannerId:string,status:boolean):Promise<IBanner | null>{
    return await this.bannerRep.updateBannerStatus(bannerId,status)
  }

  async onSearch(searchTerm:string):Promise<IBanner[]>{
    return await this.bannerRep.searchBanner(searchTerm)
  }
}