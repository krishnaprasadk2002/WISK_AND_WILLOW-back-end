import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
export interface authenticatedEmployeeRequest extends Request{
    employee?:any
}

export const employeeAuthMiddleware = (req: authenticatedEmployeeRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.employeeToken;
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'wiskandwillow';
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.employee = decoded 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
