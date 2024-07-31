import { OtpRepository } from './../../respository/otp.repository';
import express from 'express';
import { UserController } from '../../controllers/userController';
import { UserUseCase } from '../../usecase/userUseCase';
import { UserRepository } from '../../respository/userRepository';
import authenticateToken from '../middlewares/authenticateToken';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository()
const userUseCase = new UserUseCase(userRepository,otpRepository);
const userController = new UserController(userUseCase);

const router = express.Router();

router.post('/register', (req, res) => userController.userSignUp(req, res));
router.post('/verify-otp',(req,res) => userController.verifyOtp(req,res))
router.post('/resend-otp',(req,res)=>userController.resendOtp(req,res))
router.post('/login',(req,res)=>userController.userLogin(req,res))
router.post('/logout',(req,res)=>userController.userLogout(req,res))

export default router;
