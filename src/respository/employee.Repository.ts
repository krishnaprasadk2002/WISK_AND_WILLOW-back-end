import IBooking from "../entities/booking.entity";
import  Employee  from "../entities/employee.entity";
import BookingModel from "../frameworks/models/booking.model";
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

    async getEmployees(page: number, itemsPerPage: number):Promise<Employee[]>{
        const skip = (page - 1) * itemsPerPage;
        return await EmployeeModel.find().skip(skip).limit(itemsPerPage) as Employee[]
    }

    async getEmployeesCount():Promise<number>{
        return EmployeeModel.countDocuments()
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

    async searchEmployees(searchTerm: string): Promise<Employee[]> {
        return EmployeeModel.find({
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } }, 
            { email: { $regex: searchTerm, $options: 'i' } },
            { mobile: { $regex: searchTerm, $options: 'i' } },
          ]
        });
      }

      async getEmployeeDataById(empId:string):Promise<Employee[] | null>{
        return EmployeeModel.findById(empId)
      }
      
      async getEmployeeBookings(empId: string): Promise<IBooking[] | null> {
        const employeeBookingData = await BookingModel.find({ assignedEmployeeId: empId });
        return employeeBookingData.length ? employeeBookingData : [];
      }
      

}