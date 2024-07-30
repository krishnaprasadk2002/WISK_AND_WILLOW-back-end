import jwt from "jsonwebtoken"
import { Request, Response } from 'express';
import { AdminUseCase } from "../usecase/adminUseCase";

export class AdminController {
    private adminUseCase: AdminUseCase
    constructor(adminUseCase: AdminUseCase) {
        this.adminUseCase = adminUseCase
    }

    async adminLogin(req: Request, res: Response) {
        const { email, password } = req.body

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret not defined' });
        }

        if (adminEmail === email && adminPassword === password) {
            const adminToken = jwt.sign({ email }, jwtSecret || "wiskandwillow", { expiresIn: '30d' })

            //    set cokkie

            res.cookie('adminToken', adminToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',// Cookie is sent only over HTTPS in production
                maxAge: 3600000,// 1 hour
                sameSite: 'strict',// Helps protect against CSRF attacks
            })
            res.status(200).json({ message: 'Login successful' })
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
}