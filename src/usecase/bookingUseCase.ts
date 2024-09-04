import { BookingRepository } from "../respository/bookingRepository";
import IBooking, { IRazorpayOrder } from "../entities/booking.entity";
import razorpayInstance from "../frameworks/configs/razorpay";
import crypto from 'crypto';

type bookingData = IBooking | IRazorpayOrder


export class BookingUseCase {
    constructor(private bookingRep: BookingRepository) { }

    async createBooking(bookingData: IBooking): Promise<bookingData | undefined> {
        try {

            const paymentCapture = 1;
            const amount = bookingData.nowPayableAmount;
            const currency = 'INR';

            const options = {
                amount,
                currency,
                receipt: `receipt_order_${Date.now()}`,
                payment_capture: paymentCapture,
            };

            const order = await razorpayInstance.orders.create(options);

            bookingData.paymentOrderId = order.id;
            const savedBooking = await this.bookingRep.createBooking(bookingData);
            return order as unknown as bookingData;
        } catch (error) {
            console.error("Error creating booking with Razorpay:", { error, bookingData });
            throw new Error("Failed to create booking");
        }
    }

    async verifyPayment(razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string): Promise<boolean> {
        try {
            const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest('hex');

            if (generated_signature === razorpay_signature) {
                await this.bookingRep.updateBookingPayment(razorpay_order_id, razorpay_payment_id, "successful");
                return true;
            } else {
                console.error("Invalid payment signature.");
                await this.bookingRep.updateBookingStatus(razorpay_order_id, "failed");
                return false;
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw new Error("Failed to verify payment");
        }

    }

    async verifyBalancePayment(razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string,id:string): Promise<boolean> {
        try {
          const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
      
          if (generated_signature === razorpay_signature) {
            // await this.bookingRep.updateBookingPayment(razorpay_order_id, razorpay_payment_id, "successful");
      
            await this.bookingRep.updateBookingPaymentDetails(id, {
              paymentOption: 'Fully Paid',
              balanceAmount: 0
            });
      
            return true;
          } else {
            console.error("Invalid payment signature.");
            await this.bookingRep.updateBookingStatus(razorpay_order_id, "failed");
            return false;
          }
        } catch (error) {
          console.error("Error verifying balance payment:", error);
          throw new Error("Failed to verify balance payment");
        }
    }

    async updateBookingStatus(orderId: string, status: string): Promise<void> {
        await this.bookingRep.updateBookingStatus(orderId, status);
      }

    
  async searchBookingData(searchTerm: string): Promise<IBooking[]> {
    return this.bookingRep.searchBookings(searchTerm);
  }

  async getBookings(page: number, itemsPerPage: number): Promise<{ booking: IBooking[], totalItems: number }> {
    return this.bookingRep.getBookings(page, itemsPerPage);
  }

  async getBookingInUserProfile(email:string):Promise<IBooking[]>{
    return await this.bookingRep.findByEmail(email)
  }
  

  async userProfileBalancePayament(bookingData:IBooking):Promise<bookingData | undefined >{
    try {
        const _id = bookingData._id
        const paymentCapture = 1;
        const amount = bookingData.balanceAmount;
        const currency = 'INR';

        const options ={
            amount,
            currency,
            receipt: `receipt_order_${Date.now()}`,
            payment_capture: paymentCapture,
        }

        const order = await razorpayInstance.orders.create(options)
        bookingData.paymentOrderId = order.id;
        return {...order,_id} as unknown as bookingData
    }  catch (error) {
        console.error("Error creating booking with Razorpay:", { error, bookingData });
        throw new Error("Failed to userProfile balance amountpaying");
    }
  }
      
}