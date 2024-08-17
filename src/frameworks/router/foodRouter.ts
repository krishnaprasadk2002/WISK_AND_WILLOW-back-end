import express from 'express';
import { FoodRepository } from '../../respository/food.Repository';
import { FoodUseCase } from '../../usecase/foodUseCase';
import { FoodController } from '../../controllers/foodController';

const foodRouter = express()
const foodRep = new FoodRepository()
const foodUseCase = new FoodUseCase(foodRep)
const foodController = new FoodController(foodUseCase)

foodRouter.post('/addFood',(req,res)=>foodController.addFood(req,res))
foodRouter.get('/getfoods',(req,res)=>foodController.getFood(req,res))
foodRouter.put('/editfooddata', (req, res) => foodController.editFood(req, res));
foodRouter.get('/search',(req,res)=>foodController.onSearch(req,res))

export default foodRouter