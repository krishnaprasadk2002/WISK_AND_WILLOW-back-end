import { AdminUseCase } from './../../usecase/adminUseCase';
import express from "express";
import { AdminController } from "../../controllers/adminController";
import { AdminRepository } from "../../respository/adminRepository";
import {EventRepository } from '../../respository/eventRepository';
import { adminAuthMiddleware } from '../middlewares/adminAuthentication';
import setDownloadHeaders from '../middlewares/excelMiddileWare';

const adminRouter = express()

const adminRepository = new AdminRepository()
const eventRepository = new EventRepository()
const adminUseCase = new AdminUseCase(eventRepository,adminRepository)
const adminController = new AdminController(adminUseCase)

adminRouter.post('/login',(req,res)=>adminController.adminLogin(req,res))
adminRouter.post('/logout', (req, res) => adminController.adminLogout(req, res));
adminRouter.get('/userdata',adminAuthMiddleware,(req,res)=>adminController.getUsers(req,res))
adminRouter.post('/updateUserStaus',(req,res)=>adminController.UpdateUserStatus(req,res))
adminRouter.get('/allevents',adminAuthMiddleware,(req,res)=>adminController.getEvents(req,res))
adminRouter.get('/search',adminAuthMiddleware,(req,res)=>adminController.onSearch(req,res))
adminRouter.get('/isAuth',adminAuthMiddleware,(req,res)=>adminController.isAuth(req,res))
adminRouter.get('/getdashboard',adminAuthMiddleware,(req,res)=>adminController.getDashBoardData(req,res))
adminRouter.get('/monthly-bookings',adminAuthMiddleware,(req,res)=>adminController.getMonthlyBookings(req,res))
adminRouter.get('/yearly-bookings',(req,res)=>adminController.getYearlyBookings(req,res))
adminRouter.get('/daily-bookings',(req,res)=>adminController.getDailyBookings(req,res))
adminRouter.get('/bookings', (req, res) => adminController.getBookings(req, res));
adminRouter.get('/export-bookings', setDownloadHeaders,(req, res) => adminController.exportBookings(req, res));




export default adminRouter