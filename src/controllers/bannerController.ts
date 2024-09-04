import { Request, Response } from "express";
import IBanner from "../entities/banner.entity";
import { BannerUseCase } from "../usecase/bannerUseCase";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import { HttpStatusCode } from "../enums/httpStatusCodes";

export class BannerController {

  constructor(private bannerUseCasse: BannerUseCase) { }

  async addBanner(req: Request, res: Response) {
    const { name, description, image } = req.body

    try {
      const imageUrl = await uploadCloudinary(image)

      const bannerData: IBanner = {
        name,
        description,
        image: imageUrl,
      };

      const newBanner = await this.bannerUseCasse.addBanner(bannerData);
      res.status(HttpStatusCode.CREATED).json(newBanner)

    } catch (error) {
      console.error('Error adding banner:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server error, please try again later.' });
    }
  }

  async getBanners(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;

      const { banner, totalItems } = await this.bannerUseCasse.getBannerImage(page, itemsPerPage);
      res.status(HttpStatusCode.OK).json({ banners: banner, totalItems });
    } catch (error) {
      console.error('Error Fetching banners', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  async updateBannerStatus(req: Request, res: Response) {
    try {
      const { bannerId, banner } = req.body;
      console.log('Received bannerId:', bannerId); 
      console.log('Received banner status:', banner.status); 

      const updatedBanner = await this.bannerUseCasse.updateBannerStatus(bannerId, banner.status);

      if (updatedBanner) {
        res.status(HttpStatusCode.OK).json(updatedBanner);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Banner not found' });
      }
    } catch (error) {
      console.error('Error updating banner status:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  async onSearch(req:Request,res:Response){
    const searchTerm = req.query.searchTerm as string;
    try {
      const searchBanner = await this.bannerUseCasse.onSearch(searchTerm)
      res.json(searchBanner)
    } catch (error) {
      console.error('Error searching banner:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error searching banner' });
    }
  }
}