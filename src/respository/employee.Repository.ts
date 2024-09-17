import  Employee  from "../entities/employee.entity";
import EmployeeModel from "../frameworks/models/employee.model";
import { hashPassword } from "../frameworks/utils/hashedPassword";
import { IEmployeeRepository } from "../interfaces/repositories/employeeRepository";

export class employeeRepository implements IEmployeeRepository{

    constructor(){}

    async registerEmployee(name: string, email: string, mobile: string,type:string,password: string):Promise<Employee>{
        const hashedPassword = await hashPassword(password);
        const employee = new EmployeeModel({name,email,mobile,type,password:hashedPassword})
        return await employee.save()
    }

    async findUserEmail(email: string): Promise<Employee | null> {
        return await EmployeeModel.findOne({ email })
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return await EmployeeModel.findOne({ email })
    }

    async getEmployees():Promise<Employee[]>{
        return await EmployeeModel.find()
    }

    async updateEmployeeStatus(id: string, status: 'Approved' | 'Rejected'): Promise<Employee | null> {
        const updateEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            {
                $set: { is_employee: status }
            },
            {
                new: true
            }
        );
        console.log(updateEmployee);
        
        return updateEmployee;
    }    

    async getEmployeeDetails():Promise<Employee[]>{
        const employeeData = await EmployeeModel.find({is_employee:'Approved'})
        return employeeData
    }

}