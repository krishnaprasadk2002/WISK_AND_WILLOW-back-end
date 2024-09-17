import IBooking from "../../entities/booking.entity";

export interface IBookingRepository{
    createBooking(bookingData: IBooking): Promise<IBooking>
    updateBookingStatus(paymentOrderId: string, status: string): Promise<void> 
    updateBookingPayment(paymentOrderId: string, paymentId: string, status: string): Promise<void> 
    searchBookings(searchTerm: string): Promise<IBooking[]>
    getBookings(page: number, itemsPerPage: number): Promise<{ booking: IBooking[], totalItems: number }>
    findByEmail(email: string): Promise<IBooking[]>
    updateBookingPaymentDetails(id: string, updateData: { paymentOption: string, balanceAmount: number }): Promise<void>
    findById(bookingId: string): Promise<IBooking | null> 
    updateBooking(bookingId: string, updateData: Partial<IBooking>): Promise<IBooking | null>
}