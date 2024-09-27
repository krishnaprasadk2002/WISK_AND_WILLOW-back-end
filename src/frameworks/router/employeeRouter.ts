import express from 'express';
import { employeeRepository } from '../../respository/employee.Repository';
import { employeeUseCase } from '../../usecase/employee.useCase';
import { EmployeeController } from '../../controllers/employeeController';
import { adminAuthMiddleware } from '../middlewares/adminAuthentication';
import { employeeAuthMiddleware } from '../middlewares/employeeAuthentication';

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
employeeRouter.get('/search', (req, res) => employeeController.searchEmployees(req, res));
employeeRouter.get('/loadempdata',employeeAuthMiddleware,(req,res)=>employeeController.getEmployeeDataById(req,res))
employeeRouter.get('/bookings', employeeAuthMiddleware, (req, res) => employeeController.getEmployeeBookings(req, res));
employeeRouter.get('/isAuth',employeeAuthMiddleware,(req,res)=>employeeController.isAuth(req,res))

  

export default employeeRouter