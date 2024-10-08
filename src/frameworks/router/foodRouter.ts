import express from 'express';
import { FoodRepository } from '../../respository/food.Repository';
import { FoodUseCase } from '../../usecase/foodUseCase';
import { FoodController } from '../../controllers/foodController';
import { adminAuthMiddleware } from '../middlewares/adminAuthentication';

const foodRouter = express()
const foodRep = new FoodRepository()
const foodUseCase = new FoodUseCase(foodRep)
const foodController = new FoodController(foodUseCase)

foodRouter.post('/addFood',(req,res)=>foodController.addFood(req,res))
foodRouter.get('/getfoods',adminAuthMiddleware,(req,res)=>foodController.getFood(req,res))
foodRouter.put('/editfooddata', (req, res) => foodController.editFood(req, res));
foodRouter.get('/search',adminAuthMiddleware,(req,res)=>foodController.onSearch(req,res))

export default foodRouter