import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
export interface authenticatedEmployeeRequest extends Request{
    employee?:decodedEmp

}

export interface decodedEmp{
    empId: string,
    email: string,
    iat: string,
    exp: string
}

export const employeeAuthMiddleware = (req: authenticatedEmployeeRequest, res: Response, next: NextFunction) => {
    
    const token = req.cookies.employeeToken;
    
    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'wiskandwillow';
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.employee = decoded as unknown as decodedEmp;
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

