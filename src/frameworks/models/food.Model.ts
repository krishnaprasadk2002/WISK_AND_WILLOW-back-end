import mongoose, { Schema, Document } from "mongoose";
import { IFood } from "../../entities/food.entity";

const FoodSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Vegetarian', 'Non-vegetarian'] }, 
  pricePerPlate: { type: Number, required: true },
  section: { type: String, required: true, enum: ['Welcome Drink', 'Main Food', 'Dessert'] }, 
  status: { type: String, required: true , enum:['Available' , 'Unavailable'] }, 
});

const Food = mongoose.model<IFood & Document>('Food', FoodSchema);
export default Food;
