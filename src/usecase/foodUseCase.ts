import { FoodRepository } from "../respository/food.Repository";
import { IFood } from "../entities/food.entity";

export class FoodUseCase{

    constructor(private foodRep:FoodRepository){}

   async addFood(foodData:IFood):Promise<IFood>{
    return await this.foodRep.addFood(foodData)
   }

   async getFoods(): Promise<IFood[]> {
    return await this.foodRep.getFoods()
    }

    async editFood(foodId:string, foodData: IFood):Promise<IFood | null>{
      return await this.foodRep.editFoodData(foodId,foodData)
    }

}