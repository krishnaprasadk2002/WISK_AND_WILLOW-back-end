import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { employeeUseCase } from "../usecase/employee.useCase";
import { HttpStatusCode } from "../enums/httpStatusCodes";
import { authenticatedEmployeeRequest } from "../frameworks/middlewares/employeeAuthentication";

export class EmployeeController {
  constructor(private employeeUseCase: employeeUseCase) { }

  async emplyeeRegister(req: Request, res: Response) {
    const { name, email, mobile, type, password } = req.body;
    try {
      const employe = await this.employeeUseCase.register(name, email, mobile, type, password)
      res.status(HttpStatusCode.CREATED).json({ message: 'Employee registered successfully', employe });
    } catch (error) {
      console.error(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Registration failed' });
    }
  }

  async employeeLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid input data' });
        return;
      }

      const employee = await this.employeeUseCase.findByEmail(email);
      if (!employee) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Invalid email or password' });
        return;
      }

      const PasswordValid = await bcrypt.compare(password, employee.password);
      if (!PasswordValid) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Invalid email or password' });
        return;
      }

      if (employee.is_employee !== 'Approved') {
        res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Employee not verified. Please wait for admin verification.' });
        return;
      }

      const employeeToken = jwt.sign({ empId: employee._id, email: employee.email }, process.env.JWT_SECRET || 'wiskandwillow', { expiresIn: '30d' })

      res.cookie('employeeToken', employeeToken, {
        httpOnly: true,
        secure: process.env.NODE_Env === 'production',
        maxAge: 3600000,
        sameSite: 'strict',
      })
      
      res.status(HttpStatusCode.OK).json({ message: 'Login successful', employee });
    } catch (error) {
      console.error(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Login failed' });
    }
  }

  async employeeLogout(req: Request, res: Response) {
    try {
      res.clearCookie('employeeToken')
      res.status(HttpStatusCode.OK).json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Logout failed' });
    }
  }

  async getEmployeeData(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;
      const employes = await this.employeeUseCase.getEmployeeData(page, itemsPerPage)
      res.status(HttpStatusCode.OK).json(employes)
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Fetching employee data failed" });
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
      res.status(HttpStatusCode.OK).json(updatedEmployee);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating employee status', error });
    }
  }

  async getEmployeeDetails(req: Request, res: Response) {
    try {
      const employeeDetails = await this.employeeUseCase.getEmployeeDetails()
      res.status(200).json(employeeDetails)
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating employee status', error });
    }
  }

  async searchEmployees(req: Request, res: Response) {
    try {
      const searchTerm = req.query.searchTerm as string;
      console.log(searchTerm);
  
      const searchEmployeesData = await this.employeeUseCase.searchEmployee(searchTerm);
      res.status(HttpStatusCode.OK).json(searchEmployeesData);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error Fetching data in Employees', error });
    }
  }

  async getEmployeeDataById(req: authenticatedEmployeeRequest, res: Response) {
    try {
      const empId = req.employee?.empId as string
       const employeeData = await this.employeeUseCase.getEmployeeDataById(empId)
       
       res.status(HttpStatusCode.OK).json(employeeData)
    } catch (error) {
        console.log('Error fetching employee data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

async getEmployeeBookings(req: authenticatedEmployeeRequest, res: Response) {
  try {
    const empId = req.employee?.empId as string;
    if (!empId) {
      return res.status(400).json({ message: 'Employee ID is missing' });
    }

    const employeeBookingData = await this.employeeUseCase.getEmployeeBookings(empId);
    console.log('Employee booking data:', employeeBookingData);
    res.status(HttpStatusCode.OK).json(employeeBookingData);
  } catch (error) {
    console.log('Error fetching employee assigned events data:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
  }
}

async isAuth(req:Request,res:Response){
  res.status(HttpStatusCode.OK).json({message:"Success"})
}

}     
