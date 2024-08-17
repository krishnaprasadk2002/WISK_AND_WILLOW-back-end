import { AdminUseCase } from './../../usecase/adminUseCase';
import express from "express";
import { AdminController } from "../../controllers/adminController";
import { AdminRepository } from "../../respository/adminRepository";
import {EventRepository } from '../../respository/eventRepository';

const adminRouter = express()

const adminRepository = new AdminRepository()
const eventRepository = new EventRepository()
const adminUseCase = new AdminUseCase(eventRepository,adminRepository)
const adminController = new AdminController(adminUseCase)

adminRouter.post('/login',(req,res)=>adminController.adminLogin(req,res))
adminRouter.post('/logout', (req, res) => adminController.adminLogout(req, res));
adminRouter.get('/userdata',(req,res)=>adminController.getUsers(req,res))
adminRouter.post('/updateUserStaus',(req,res)=>adminController.UpdateUserStatus(req,res))
adminRouter.get('/allevents',(req,res)=>adminController.getEvnts(req,res))
adminRouter.get('/search',(req,res)=>adminController.onSearch(req,res))

export default adminRouter