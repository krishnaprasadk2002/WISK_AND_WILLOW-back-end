import Users from "../models/user.model";
import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface CheckUserStatus  extends Request{
    user?:decodedUser
}

export interface decodedUser{
        userId: string,
        email: string,
        iat: string,
        exp: string
}

export const checkUserStatus =  async(req:CheckUserStatus,res:Response,next:NextFunction)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET || 'wiskandwilow');
        req.user = decoded as unknown as decodedUser;        

        const user = await Users.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(user.status){
            return res.status(403).json({ message: 'User is blocked' });
        }
        
        next()
    } catch (error) {
        return res.status(403).json({message:'Forbidden'})
    }
}