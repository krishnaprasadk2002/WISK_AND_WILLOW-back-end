import BookingModel from "../frameworks/models/booking.model";
import IBooking from "../entities/booking.entity";

export class BookingRepository{
    constructor(){}

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
}
    
