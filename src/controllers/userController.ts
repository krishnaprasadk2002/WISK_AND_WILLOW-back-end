import { Request, Response } from "express";
import { UserUseCase } from "../usecase/userUseCase";

export class UserController{
    private userUseCase:UserUseCase;

    constructor(userUseCase: UserUseCase){
        this.userUseCase  = userUseCase
    }
    async userSignUp(req: Request, res: Response) {
        const { name, email, password, mobile } = req.body;
        try {
          const user = await this.userUseCase.signUp(name, email, password, mobile);
          res.status(201).json(user);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ message: error.message });
          } else {
            res.status(400).json({ message: "An unknown error occurred" });
          }
        }
      }

      async verifyOtp(req:Request,res:Response){
        try {
          const {userId,otp} = req.body
          const result = await this.userUseCase.verifyOtp(userId,otp);
          res.status(200).json(result)
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ message: error.message });
          } else {
            res.status(400).json({ message: "An unknown error occurred" });
          }
        }
        }

        async resendOtp(req: Request, res: Response) {
          const { email } = req.body;
          try {
            const user = await this.userUseCase.findUserByEmail(email);
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            const otp = this.userUseCase.generateOtp();
            await this.userUseCase.createOtp(String(user._id), otp);
            await this.userUseCase.sendOtpEmail(email, otp);
        
            res.status(200).json({ message: 'OTP resent successfully' });
        
          } catch (error) {
            console.error('Error during OTP resend', error);
            res.status(500).json({ message: 'An error occurred during OTP resend' });
          }
        }
        
        }