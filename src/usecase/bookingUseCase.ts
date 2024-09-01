import { BookingRepository } from "../respository/bookingRepository";
import IBooking, { IRazorpayOrder } from "../entities/booking.entity";
import razorpayInstance from "../frameworks/configs/razorpay";
import crypto from 'crypto';

type bookingData =  IBooking | IRazorpayOrder


export class BookingUseCase {
    constructor(private bookingRep: BookingRepository) { }

    async createBooking(bookingData: IBooking): Promise<bookingData | undefined> {
        try {
            console.log(bookingData,"BOOKKKKINGGG");
            
            const paymentCapture = 1;
            const amount = bookingData.totalAmount ;
            const currency = 'INR';
    
            const options = {
                amount,
                currency,
                receipt: `receipt_order_${Date.now()}`,
                payment_capture: paymentCapture,
            };
    
            const order = await razorpayInstance.orders.create(options);
            console.log("Razorpay order created:", order); 
    
            bookingData.paymentId = order.id;
            bookingData.status = 'pending'; 
            const savedBooking = await this.bookingRep.createBooking(bookingData);
            return order as unknown as bookingData;
        } catch (error) {
            console.error("Error creating booking with Razorpay:", error);
            throw new Error("Failed to create booking");
        }
    }

    async verifyPayment(razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string): Promise<boolean> {
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
    
        if (generated_signature === razorpay_signature) {
            console.log("Payment verified successfully");
            await this.bookingRep.updateBookingStatus(razorpay_payment_id,"successful")
            return true;

        } else {
            console.error("Invalid payment signature. Expected:", generated_signature, "Received:", razorpay_signature);
            await this.bookingRep.updateBookingStatus(razorpay_payment_id,"failed")
            return false;
        }
    }



    
}