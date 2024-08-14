import Food from "../frameworks/models/food.Model";
import { IFood } from "../entities/food.entity";

export class FoodRepository{
    constructor(){}

    async addFood(foodData:IFood):Promise<IFood>{
        const food = new Food(foodData)
        const formDataValues = await food.save()
        return formDataValues
    }

    async getFoods(): Promise<IFood[]> {
        return await Food.find() as IFood[];
    }

    async editFoodData(foodId:string,foodData:IFood):Promise<IFood | null>{
        console.log(foodData);
        
        const updatedFood = await Food.findByIdAndUpdate( foodId,foodData, { new: true });
        return updatedFood
    }
    
      
}