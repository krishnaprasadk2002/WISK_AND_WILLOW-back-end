import Employee from "../entities/employee.entity";
import { employeeRepository } from "../respository/employee.Repository";

export class employeeUseCase{
constructor(private employeeRep:employeeRepository){}

async register(name:string, email:string,mobile:string,type:string,password:string):Promise<Employee>{
    console.log("use",password);
    
    const existingEmp = await this.employeeRep.findUserEmail(email);
    if (existingEmp) {
      throw new Error("Employee already exists");
    }
    return await this.employeeRep.registerEmployee(name,email,mobile,type,password)
}
}