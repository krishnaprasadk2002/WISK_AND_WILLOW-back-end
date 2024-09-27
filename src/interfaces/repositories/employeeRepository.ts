import IBooking from "../../entities/booking.entity";
import Employee from "../../entities/employee.entity";

export interface IEmployeeRepository{
    registerEmployee(name: string, email: string, mobile: string,type:string,password: string):Promise<Employee>
    findUserEmail(email: string): Promise<Employee | null> 
    findByEmail(email: string): Promise<Employee | null>
    getEmployees(page: number, itemsPerPage: number):Promise<Employee[]>
    updateEmployeeStatus(id: string, status: 'Approved' | 'Rejected'): Promise<Employee | null> 
    getEmployeeDetails():Promise<Employee[]>
   getEmployeesCount():Promise<number>
   searchEmployees(searchTerm: string): Promise<Employee[]>
   getEmployeeDataById(empId:string):Promise<Employee[] | null>
   getEmployeeBookings(empId:string):Promise<IBooking[]|null>
        
}