import { Request, Response } from 'express';
import { AdminUseCase } from "../usecase/adminUseCase";


export class AdminController {
    private adminUseCase: AdminUseCase
    constructor(adminUseCase: AdminUseCase) {
        this.adminUseCase = adminUseCase
    }


    async adminLogin(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const adminToken: string | null = await this.adminUseCase.execute(email, password);

        console.log(adminToken);
        

        if (adminToken) {
            res.cookie('adminToken', adminToken, {
                httpOnly: true,
                secure: process.env.NODE_Env === 'production',
                maxAge: 3600000,
                sameSite: 'strict',
            })
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }


    async adminLogout(req: Request, res: Response): Promise<void> {
        this.adminUseCase.executeLogout();

        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        console.log('admin logged out');
        res.status(200).json({ message: 'Logout successful' });
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.adminUseCase.getAllUsers()
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getEvnts(req:Request,res:Response){
        try {
            const events = await this.adminUseCase.getEvents()
            res.json(events)
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async UpdateUserStatus(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body
            const updateUser = await this.adminUseCase.updateStatus(user);
            res.status(200).json(updateUser)
        } catch (error) {
            res.status(500).json({ message: 'Failed to update user status' });
        }
    }

}