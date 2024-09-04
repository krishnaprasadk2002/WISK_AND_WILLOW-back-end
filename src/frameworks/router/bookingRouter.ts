import express from 'express'
import { BookingRepository } from "../../respository/bookingRepository";
import { BookingUseCase } from "../../usecase/bookingUseCase";
import { BookingController } from "../../controllers/bookingController";

const bookingRouter = express()

const bookingRep = new BookingRepository()
const bookingUseCase = new BookingUseCase(bookingRep)
const bookingController = new BookingController(bookingUseCase)

bookingRouter.post('/createbooking',(req, res) => bookingController.createBooking(req, res));
bookingRouter.post('/verifypayment',(req, res) => bookingController.verifyPayment(req, res));
bookingRouter.post('/updateStatus',(req,res)=>bookingController.updateBookingStatus(req,res))
bookingRouter.get('/search',(req,res)=>bookingController.searchBookings(req,res))
bookingRouter.get('/getbooking',(req,res)=>bookingController.getBooking(req,res))
bookingRouter.get('/getbookinginprofile',(req,res)=>bookingController.getBookingsByEmail(req,res))
bookingRouter.post('/creatingorder',(req,res) => bookingController.userProfileBalancePayment(req,res))
bookingRouter.post('/verifybalancepayment',(req,res)=>bookingController.verifyBalancePayment(req,res))

export default bookingRouter