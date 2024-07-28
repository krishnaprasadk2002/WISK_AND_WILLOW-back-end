import express from 'express';
import { UserController } from '../../controllers/userController';
import { UserUseCase } from '../../usecase/userUseCase';
import { UserRepository } from '../../respository/userRepository';

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);

const router = express.Router();

router.post('/register', (req, res) => userController.userSignUp(req, res));


export default router;
