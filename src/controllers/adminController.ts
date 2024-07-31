import jwt from "jsonwebtoken"
import { Request, Response } from 'express';
import { AdminUseCase } from "../usecase/adminUseCase";

export class AdminController {
    private adminUseCase: AdminUseCase
    constructor(adminUseCase: AdminUseCase) {
        this.adminUseCase = adminUseCase
    }

    // async adminLogin(req: Request, res: Response) {
    //     const { email, password } = req.body

    //     const adminEmail = process.env.ADMIN_EMAIL
    //     const adminPassword = process.env.ADMIN_PASSWORD
    //     const jwtSecret = process.env.JWT_SECRET

    //     if (!jwtSecret) {
    //         return res.status(500).json({ message: 'JWT secret not defined' });
    //     }

    //     if (adminEmail === email && adminPassword === password) {
    //         const adminToken = jwt.sign({ email }, jwtSecret || "wiskandwillow", { expiresIn: '30d' })

    //         //    set cokkie

    //         res.cookie('adminToken', adminToken, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',// Cookie is sent only over HTTPS in production
    //             maxAge: 3600000,// 1 hour
    //             sameSite: 'strict',// Helps protect against CSRF attacks
    //         })
    //         res.status(200).json({ message: 'Login successful' })
    //     } else {
    //         res.status(401).json({ message: 'Invalid email or password' });
    //     }
    // }


    async adminLogin(req:Request,res:Response):Promise<void>{
     const {email,password} = req.body;

     const adminToken = this.adminUseCase.execute(email,password);

     if(adminToken){
        res.cookie('adminToken',adminToken,{
            httpOnly:true,
            secure:process.env.NODE_Env === 'production',
            maxAge:3600000,
            sameSite:'strict',
        })
        res.status(200).json({ message: 'Login successful' });
     }else{
        res.status(401).json({ message: 'Invalid email or password' });
     }
    }
     

    async adminLogout(req:Request,res:Response):Promise<void>{
        this.adminUseCase.executeLogout();

        res.clearCookie('adminToken',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        console.log('admin logged out');
        res.status(200).json({ message: 'Logout successful' });
    }

    async getUsers(req:Request,res:Response):Promise<void>{
        try {
          const users = await this.adminUseCase.getAllUsers()
          res.json(users)
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
       }

}