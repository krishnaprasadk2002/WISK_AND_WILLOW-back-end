import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import IUsers from "../../entities/user.entity";

export interface authenticatedRequest extends Request{
    user?:decodedUser
}

export interface decodedUser{
        userId: string,
        email: string,
        iat: string,
        exp: string
}

 export const authenticateToken = async(req:authenticatedRequest,res:Response,next:NextFunction)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET || 'wiskandwilow');
        req.user = decoded as unknown as decodedUser;        
        next()
    } catch (error) {
        return res.status(403).json({message:'Forbidden'})
    }
}

