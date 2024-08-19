import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
export interface authenticatedAdminRequest extends Request{
    admin?:any
}

export const adminAuthMiddleware = (req: authenticatedAdminRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'wiskandwillow';
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.admin = decoded 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
