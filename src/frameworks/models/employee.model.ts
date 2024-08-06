import mongoose, { Schema } from "mongoose";
import { Employee } from "../../entities/employee.entity";

const EmployeeSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    type: { type: String, required: true },
    password: { type: String,required:true },
    is_employee: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Pending',
    },
    
  });
  
  const EmployeeModel = mongoose.model<Employee>('Employee', EmployeeSchema);
  
  export default EmployeeModel;
