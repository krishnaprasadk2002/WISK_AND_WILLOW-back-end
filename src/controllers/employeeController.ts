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

    async employeeLogin(req: Request, res: Response): Promise<void> {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            res.status(400).json({ error: 'Invalid input data' });
            return;
          }
    
          const employee = await this.employeeUseCase.findByEmail(email);
          if (!employee) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
          }

          console.log("emp",employee);
          
    
          const PasswordValid = await bcrypt.compare(password, employee.password);
          if (!PasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
          }

          if (employee.is_employee !== 'Approved') {
            res.status(403).json({ message: 'Employee not verified. Please wait for admin verification.' });
            return;
        }

          const employeeToken = jwt.sign({ empId: employee._id, email: employee.email }, process.env.JWT_SECRET || 'wiskandwillow', { expiresIn: '30d' })

          res.cookie('employeeToken', employeeToken ,{
            httpOnly: true,
            secure: process.env.NODE_Env === 'production',
            maxAge: 3600000,
            sameSite: 'strict',
        })
          res.status(200).json({ message: 'Login successful', employee });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Login failed' });
        }
      }

      async employeeLogout(req:Request,res:Response){
        try {
          res.clearCookie('employeeToken')
          res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Logout failed' });
        }
      }

      async getEmployeeData(req:Request,res:Response){
        try {
          const employes = await this.employeeUseCase.getEmployeeData()
          res.json(employes)
        } catch (error) {
          res.status(500).json({ message: "Fetching employee data failed" });
        }
      }

      async updateEmployeeStatus(req: Request, res: Response) {
        const { id } = req.params;
        const status = req.body.is_employee;

        try {
            const updatedEmployee = await this.employeeUseCase.updateEployeeStatus(id, status);
            if (!updatedEmployee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(200).json(updatedEmployee);
        } catch (error) {
            res.status(500).json({ message: 'Error updating employee status', error });
        }
    }
    

      
}
