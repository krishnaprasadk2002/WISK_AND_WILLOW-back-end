import mongoose, { Schema, Document, Model } from "mongoose";
import IBooking from "../../entities/booking.entity";



const CartItemSchema: Schema = new Schema({
  food: {
    _id: { type: Schema.Types.ObjectId, required: true, ref: 'Food' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerPlate: { type: Number, required: true }
  },
  quantity: { type: Number, required: true }
});

const BookingSchema: Schema = new Schema({
  packageDetails: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  packageName: { type: String, required: true },
  type_of_event: { type: String, required: true },
  requested_date: { type: Date, required: true },
  payment_option: { type: String, enum: ['Advance', 'Full'], required: true },
  cart: [CartItemSchema],
  totalAmount: { type: Number, required: true },
  eventWithoutFoodPrice: { type: Number, required: true },
  foodPrice: { type: Number, required: true },
  advancePayment: { type: Number, required: true },
  nowPayableAmount: { type: Number, required: true },
  balanceAmount: { type: Number, required: true },
  paymentOrderId: { type: String }, 
  paymentId: { type: String },  
  created_at: { type: Date, default: Date.now },
  status:{type:String, default:"pending",enum:["pending","failed","successful"]},
  assignedEmployeeId: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);

export default BookingModel;
