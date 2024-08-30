import { FoodUseCase } from "../usecase/foodUseCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpStatusCodes";

export class FoodController {
    constructor(private foodUseCase: FoodUseCase) { }

    async addFood(req: Request, res: Response): Promise<void> {
        try {
            const foodData = req.body;
            if (!foodData) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Food data is required' });
                return;
            }

            const foodDataValues = await this.foodUseCase.addFood(foodData);
            if (foodDataValues) {
                res.status(HttpStatusCode.CREATED).json({ message: 'Food added successfully', foodDataValues });
            } else {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to adding food' });
            }
        } catch (error) {
            console.error('Error adding food:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    async getFood(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;

            const foodData = await this.foodUseCase.getFoods(page, itemsPerPage);
            res.status(HttpStatusCode.OK).json(foodData);
        } catch (error) {
            console.error('Error Fetching food:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }


    async editFood(req: Request, res: Response) {
        try {
            const foodData = req.body.editFoodData;
            const foodId = req.body.foodId

            if (!foodId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Food ID is required' });
            }

            const updatedData = await this.foodUseCase.editFood(foodId, foodData);

            if (!updatedData) {
                return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Food not found' });
            }

            res.status(HttpStatusCode.OK).json(updatedData);
        } catch (error) {
            console.error('Error updating food:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    async onSearch(req: Request, res: Response) {
        const searchTerm = req.query.searchTerm as string
        try {
            const searchResult = await this.foodUseCase.onSerchFood(searchTerm)
            res.json(searchResult)
        } catch (error) {
            console.error('Error searching foods:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error searching food' });
        }
    }
}
