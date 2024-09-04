import BookingModel from "../frameworks/models/booking.model";
import IBooking from "../entities/booking.entity";
import { log } from "console";

export class BookingRepository {
    constructor() { }

    async createBooking(bookingData: IBooking): Promise<IBooking> {
        try {
            const booking = new BookingModel(bookingData);
            return await booking.save();
        } catch (error) {
            console.error("Error creating booking:", error);
            throw new Error("Failed to create booking");
        }
    }

    async updateBookingStatus(paymentOrderId: string, status: string): Promise<void> {
        try {
            const result = await BookingModel.updateOne({ paymentOrderId }, { status });
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw new Error("Failed to update booking status");
        }
    }

    async updateBookingPayment(paymentOrderId: string, paymentId: string, status: string): Promise<void> {
        try {
            const result = await BookingModel.updateOne({ paymentOrderId }, { paymentId, status });
        } catch (error) {
            console.error("Error updating booking payment details:", error);
            throw new Error("Failed to update booking payment details");
        }
    }

    async searchBookings(searchTerm: string): Promise<IBooking[]> {
        return BookingModel.find({
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { packageName: { $regex: searchTerm, $options: 'i' } },
            { type_of_event: { $regex: searchTerm, $options: 'i' } }
          ]
        });
      }
    
      async getBookings(page: number, itemsPerPage: number): Promise<{ booking: IBooking[], totalItems: number }> {
        const bookings = await BookingModel.find()
          .skip((page - 1) * itemsPerPage) 
          .limit(itemsPerPage); 
      
        const totalItems = await BookingModel.countDocuments(); 
        return { booking: bookings, totalItems: totalItems };
      }

      //taking data in userProfile

      async findByEmail(email: string): Promise<IBooking[]> {
        return await BookingModel.find({ email })
      }

      async updateBookingPaymentDetails(id: string, updateData: { paymentOption: string, balanceAmount: number }): Promise<void> {
        try {
            console.log(id,"kiki");
            
            const pay =  await BookingModel.updateOne(
            { _id: id },
            {
              payment_option: updateData.paymentOption,
              balanceAmount: updateData.balanceAmount
            }
          );
        } catch (error) {
          console.error("Error updating booking payment details:", error);
          throw new Error("Failed to update booking payment details");
        }
    }
}

