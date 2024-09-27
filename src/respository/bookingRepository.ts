import BookingModel from "../frameworks/models/booking.model";
import IBooking from "../entities/booking.entity";
import { IBookingRepository } from "../interfaces/repositories/bookingRepository";

export class BookingRepository implements IBookingRepository {
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
          .limit(itemsPerPage)  
        const totalItems = await BookingModel.countDocuments(); 
        return { booking: bookings, totalItems: totalItems };   
      }
      

      async findByEmail(email: string, status: string = 'successful'): Promise<IBooking[]> {
        return await BookingModel.find({ email, status });
      }

      async updateBookingPaymentDetails(id: string, updateData: { paymentOption: string, balanceAmount: number }): Promise<void> {
        try {
            
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

    async findById(bookingId: string): Promise<IBooking | null> {
      return await BookingModel.findById(bookingId)
    }
  
    async updateBooking(bookingId: string, updateData: Partial<IBooking>): Promise<IBooking | null> {
      return await BookingModel.findByIdAndUpdate(bookingId, updateData, { new: true })
    }
}

