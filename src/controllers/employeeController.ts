import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { employeeUseCase } from "../usecase/employee.useCase";
import Employee from "../entities/employee.entity";

export class EmployeeController {
    constructor(private employeeUseCase: employeeUseCase) {}

    async emplyeeRegister(req: Request, res: Response){

            const { name, email, mobile, type, password} = req.body;
            
            try {
                const employe = await this.employeeUseCase.register(name,email,mobile,type,password)
                res.status(201).json({ message: 'Employee registered successfully', employe });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Registration failed' });
            }
    }
}
