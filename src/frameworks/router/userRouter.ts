import { OtpRepository } from './../../respository/otp.repository';
import express from 'express';
import { UserController } from '../../controllers/userController';
import { UserUseCase } from '../../usecase/userUseCase';
import { UserRepository } from '../../respository/userRepository';
import {authenticateToken} from '../middlewares/authenticateToken';
import { checkUserStatus } from '../middlewares/userBlock';

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
router.get('/userprofiledata',checkUserStatus,authenticateToken,(req,res)=>userController.userProfile(req,res));
router.put('/updateprofile',checkUserStatus,authenticateToken,(req,res)=>userController.updateProfile(req,res))
router.post('/profilePicture',checkUserStatus,authenticateToken,(req,res)=>userController.updateProfileImage(req,res))
router.post('/googlelogin',(req,res)=>userController.googleSignin(req,res))
router.post('/forgot-password',(req,res)=>userController.forgetPassword(req,res))
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));
router.get('/isAuth',authenticateToken,(req,res)=>userController.isAuth(req,res))

export default router;
