import { FoodRepository } from "../respository/food.Repository";
import { IFood } from "../entities/food.entity";

export class FoodUseCase{

    constructor(private foodRep:FoodRepository){}

   async addFood(foodData:IFood):Promise<IFood>{
    return await this.foodRep.addFood(foodData)
   }

   async getFoods(page: number, itemsPerPage: number): Promise<{ foods: IFood[], totalItems: number }> {
    const foods = await this.foodRep.getFoods(page, itemsPerPage);
    const totalItems = await this.foodRep.getFoodCount();
    return { foods, totalItems };
}


    async editFood(foodId:string, foodData: IFood):Promise<IFood | null>{
      return await this.foodRep.editFoodData(foodId,foodData)
    }

    async onSerchFood(searchTerm:string):Promise<IFood[]>{
      return await this.foodRep.onSearch(searchTerm)
    }

}