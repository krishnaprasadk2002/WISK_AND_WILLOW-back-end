import IFood from "../../entities/food.entity";

export interface IFoodRepository{
    addFood(foodData:IFood):Promise<IFood>
    getFoods(page: number, itemsPerPage: number): Promise<IFood[]> 
    getFoodCount(): Promise<number>
    editFoodData(foodId:string,foodData:IFood):Promise<IFood | null>
    onSearch(searchTerm:string):Promise<IFood[]>
}