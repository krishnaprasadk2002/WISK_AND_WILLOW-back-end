import express from 'express'

import { employeeRepository } from '../../respository/employee.Repository';
import { employeeUseCase } from '../../usecase/employee.useCase';
import { EmployeeController } from '../../controllers/employeeController';
import { adminAuthMiddleware } from '../middlewares/adminAuthentication';

const employeeRep = new employeeRepository()
const employeeUsecase = new employeeUseCase(employeeRep)
const employeeController = new EmployeeController(employeeUsecase)

const employeeRouter = express()


employeeRouter.post('/register', (req,res)=> employeeController.emplyeeRegister(req, res));
employeeRouter.post('/login',(req,res)=>employeeController.employeeLogin(req,res))
employeeRouter.post('/logout',(req,res)=>employeeController.employeeLogout(req,res))
employeeRouter.get('/getemployees',adminAuthMiddleware,(req,res)=>employeeController.getEmployeeData(req,res))
employeeRouter.put('/empstatus/:id',(req,res)=>employeeController.updateEmployeeStatus(req,res))
employeeRouter.get('/getemployee',(req,res)=>employeeController.getEmployeeDetails(req,res))
employeeRouter.get('/serach',(req,res)=>employeeController.serachEmployees(req,res))

export default employeeRouter