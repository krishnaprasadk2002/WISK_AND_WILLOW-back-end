import  Employee  from "../entities/employee.entity";
import EmployeeModel from "../frameworks/models/employee.model";
import bcrypt from 'bcrypt';
import { hashPassword } from "../frameworks/utils/hashedPassword";

export class employeeRepository{

    constructor(){}

    async registerEmployee(name: string, email: string, mobile: string,type:string,password: string):Promise<Employee>{
        const hashedPassword = await hashPassword(password);
        const employee = new EmployeeModel({name,email,mobile,type,password:hashedPassword})
        return await employee.save()
    }

    async findUserEmail(email: string): Promise<Employee | null> {
        return await EmployeeModel.findOne({ email })
    }

}