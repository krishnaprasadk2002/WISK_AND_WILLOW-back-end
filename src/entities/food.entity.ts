export interface IFood {
    name: string;
    category: 'Vegetarian' | 'Non-vegetarian';
    pricePerPlate: number;
    section: FoodSection;
    status: 'Available' | 'Unavailable';
}

enum FoodSection    {
    WelcomeDrink = 'Welcome Drink',
    MainFood = 'Main Food',
    Dessert = 'Dessert'
  }

export default IFood