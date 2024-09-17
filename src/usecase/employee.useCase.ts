import Employee from "../entities/employee.entity";
import { IEmployeeRepository } from "../interfaces/repositories/employeeRepository";

export class employeeUseCase{
constructor(private employeeRep:IEmployeeRepository){}

async register(name:string, email:string,mobile:string,type:string,password:string):Promise<Employee>{
    console.log("use",password);
    
    const existingEmp = await this.employeeRep.findUserEmail(email);
    if (existingEmp) {
      throw new Error("Employee already exists");
    }
    return await this.employeeRep.registerEmployee(name,email,mobile,type,password)
}


async findByEmail(email: string): Promise<Employee | null> {
    return await this.employeeRep.findByEmail(email);
  }

  async getEmployeeData():Promise<Employee[]>{
    return this.employeeRep.getEmployees()
  }
  

  // employee status updating

  async updateEployeeStatus(id: string, status: 'Approved' | 'Rejected'): Promise<Employee | null> {
    const updatedEmployee = await this.employeeRep.updateEmployeeStatus(id, status);
    if (!updatedEmployee) {
        throw new Error('Employee not found or could not be updated');
    }
    return updatedEmployee;
}

async getEmployeeDetails():Promise<Employee[]>{
  const employeeData = await this.employeeRep.getEmployeeDetails()
  return employeeData
}

}