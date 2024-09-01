import { BookingUseCase } from "../usecase/bookingUseCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpStatusCodes";
import IBooking from "../entities/booking.entity";

export class BookingController{
    constructor(private bookingUseCase:BookingUseCase){}

    async createBooking(req:Request,res:Response){
        try {
            const bookingData:IBooking = req.body
            console.log("booking datas are avilabile",bookingData);
            
            const newBooking = await this.bookingUseCase.createBooking(bookingData)
            res.status(HttpStatusCode.CREATED).json(newBooking)
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create booking' })
        }
    }

    async verifyPayment(req:Request,res:Response){
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
            console.log(razorpay_payment_id, razorpay_order_id, razorpay_signature);

            const isValidPatyment = await this.bookingUseCase.verifyPayment(razorpay_payment_id,razorpay_order_id,razorpay_signature)
             if(isValidPatyment){
                res.status(HttpStatusCode.OK).json({ message: 'Payment verified successfully' });
             }else{
                res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid payment signature' });
             }
            
        } catch (error) {
            console.error('Error verifying payment:', error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to verify payment' });
        }
    }

}