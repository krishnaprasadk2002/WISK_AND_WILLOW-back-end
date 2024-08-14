import { FoodUseCase } from "../usecase/foodUseCase";
import IFood from "../entities/food.entity";
import { Request, Response } from "express";

export class FoodController {
    constructor(private foodUseCase: FoodUseCase) { }

    async addFood(req: Request, res: Response): Promise<void> {
        try {
            const foodData = req.body;
            console.log(req.body);

            if (!foodData) {
                res.status(400).json({ message: 'Food data is required' });
                return;
            }
            console.log("Food data received:", foodData);
            const foodDataValues = await this.foodUseCase.addFood(foodData);
            if (foodDataValues) {
                res.status(201).json({ message: 'Food added successfully', foodDataValues });
            } else {
                res.status(500).json({ message: 'Failed to adding food' });
            }
        } catch (error) {
            console.error('Error adding food:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getFood(req: Request, res: Response) {
        try {
            const foodData = await this.foodUseCase.getFoods();
            res.status(200).json(foodData);
        } catch (error) {
            console.error('Error Fetching food:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async editFood(req: Request, res: Response) {
        try {
            const foodData = req.body.editFoodData;
            const foodId = req.body.foodId

            console.log(foodData,"fhdnjkshjhkj");
            console.log(foodId);
    
            if (!foodId) {
                return res.status(400).json({ message: 'Food ID is required' });
            }
    
            const updatedData = await this.foodUseCase.editFood(foodId, foodData);
            
            if (!updatedData) {
                return res.status(404).json({ message: 'Food not found' });
            }
    
            res.status(200).json(updatedData);
        } catch (error) {
            console.error('Error updating food:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
}
