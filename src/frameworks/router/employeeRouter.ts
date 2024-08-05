import express from 'express'

import { employeeRepository } from '../../respository/employee.Repository';
import { employeeUseCase } from '../../usecase/employee.useCase';
import { EmployeeController } from '../../controllers/employeeController';

const employeeRep = new employeeRepository()
const employeeUsecase = new employeeUseCase(employeeRep)
const employeeController = new EmployeeController(employeeUsecase)

const employeeRouter = express()


employeeRouter.post('/register', (req,res)=> employeeController.emplyeeRegister(req, res));

export default employeeRouter