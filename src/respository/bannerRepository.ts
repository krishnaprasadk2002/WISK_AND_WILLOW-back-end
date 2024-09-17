import Banner from "../frameworks/models/banner.model";
import  IBanner  from "../entities/banner.entity";
import { IBannerRepository } from "../interfaces/repositories/bannerRepository";


export class BannerRepository implements IBannerRepository{
    constructor(){}

    async addBanner(bannerData:IBanner):Promise<IBanner>{
        const banner = new Banner(bannerData)
        return banner.save()
    }

    async getBanners(page:number,itemsPerPage:number):Promise<IBanner[]>{
        const skip =(page -1) * itemsPerPage;
        return await Banner.find()
        .skip(skip)
        .limit(itemsPerPage) as IBanner[]
    }

    async getBannerImageCount():Promise<number>{
        return await Banner.countDocuments();
    }

    async updateBannerStatus(bannerId: string, status: boolean): Promise<IBanner | null> {
        return await Banner.findByIdAndUpdate(
          bannerId,
          { status: status },
          { new: true }
        )
      }

      async searchBanner(searchTerm:string):Promise<IBanner[]>{
        return await Banner.find({
            $or:[
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ]
        })
      }

}