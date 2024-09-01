import { BookingUseCase } from "../usecase/bookingUseCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpStatusCodes";
import IBooking from "../entities/booking.entity";

export class BookingController{
    constructor(private bookingUseCase:BookingUseCase){}

    async createBooking(req: Request, res: Response) {
        try {
            const bookingData: IBooking = req.body;

            if (!bookingData) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid booking data' });
            }

            const newBooking = await this.bookingUseCase.createBooking(bookingData);
            res.status(HttpStatusCode.CREATED).json(newBooking);
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create booking' });
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: 'error', error: 'Missing payment details' });
            }
    
            const isValidPayment = await this.bookingUseCase.verifyPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);
            if (isValidPayment) {
                res.status(HttpStatusCode.OK).json({ status: 'success', message: 'Payment verified successfully' });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: 'error', error: 'Invalid payment signature' });
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Failed to verify payment' });
        }
    }

    async updateBookingStatus(req: Request, res: Response) {
        try {
          const { orderId, status } = req.body;
          if (!orderId || !status) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid request data' });
          }
    
          await this.bookingUseCase.updateBookingStatus(orderId, status);
          res.status(HttpStatusCode.OK).json({ message: 'Booking status updated successfully' });
        } catch (error) {
          console.error('Error updating booking status:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update booking status' });
        }
      }
    
}