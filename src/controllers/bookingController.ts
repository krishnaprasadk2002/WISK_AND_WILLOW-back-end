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

      async searchBookings(req: Request, res: Response): Promise<void> {
        try {
          const searchTerm = req.query.searchTerm as string;
          
          if (!searchTerm) {
            res.status(HttpStatusCode.BAD_REQUEST).send({ error: 'Search term is required' });
            return;
          }
    
          const bookings = await this.bookingUseCase.searchBookingData(searchTerm);
          res.status(HttpStatusCode.OK).json(bookings);
        } catch (error) {
          console.error('Error in searchBookings:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ error: 'Error fetching bookings' });
        }
      }
    
      async getBooking(req: Request, res: Response) {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 4;
      
          const result = await this.bookingUseCase.getBookings(page, itemsPerPage);
          res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ error: 'Error fetching bookings' });
        }
      }

      async getBookingsByEmail(req: Request, res: Response): Promise<Response> {
        try {
          const { email } = req.query;
          if (!email) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Email is required' });
          }
          const bookings = await this.bookingUseCase.getBookingInUserProfile(email as string);
          return res.status(HttpStatusCode.OK).json(bookings);
        } catch (error) {
          console.error('Error fetching bookings for user profile:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching bookings for user profile', error });
        }
      }

      async userProfileBalancePayment(req:Request,res:Response){
        try {
          const bookingData: IBooking = req.body;

          if (!bookingData) {
              return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid booking data' });
          }

          const newBookingorderId = await this.bookingUseCase.userProfileBalancePayament(bookingData)
          res.status(HttpStatusCode.OK).json(newBookingorderId)
        } catch (error) {
          console.error('Error creating orderId:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create orderId' });
        }
      }

      async verifyBalancePayment(req: Request, res: Response) {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature ,id} = req.body;
            
            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ status: 'error', error: 'Missing payment details' });
            }
            const isValidPayment = await this.bookingUseCase.verifyBalancePayment(razorpay_payment_id, razorpay_order_id, razorpay_signature,id);
    
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
}