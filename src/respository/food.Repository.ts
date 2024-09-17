import Food from "../frameworks/models/food.Model";
import { IFood } from "../entities/food.entity";
import { IFoodRepository } from "../interfaces/repositories/foodRepository";

export class FoodRepository implements IFoodRepository{
    constructor(){}

    async addFood(foodData:IFood):Promise<IFood>{
        const food = new Food(foodData)
        const formDataValues = await food.save()
        return formDataValues
    }

    async getFoods(page: number, itemsPerPage: number): Promise<IFood[]> {
        const skip = (page - 1) * itemsPerPage;
        return await Food.find()
            .skip(skip)
            .limit(itemsPerPage) as IFood[];
    }
    
    async getFoodCount(): Promise<number> {
        return await Food.countDocuments();
    }
    

    async editFoodData(foodId:string,foodData:IFood):Promise<IFood | null>{
        console.log(foodData);
        
        const updatedFood = await Food.findByIdAndUpdate( foodId,foodData, { new: true });
        return updatedFood
    }

    async onSearch(searchTerm:string):Promise<IFood[]>{
        return await Food.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { section: { $regex: searchTerm, $options: 'i' } },
                { status: { $regex: searchTerm, $options: 'i' } },
            ]
        })
    }
}