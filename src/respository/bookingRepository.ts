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

        async updateBookingStatus(paymentId:string,status:string):Promise<void>{
            try {
                await BookingModel.updateOne({paymentId},{status})
            } catch (error) {
                console.error("Error updating booking status:", error);
            }
        }
    }
    