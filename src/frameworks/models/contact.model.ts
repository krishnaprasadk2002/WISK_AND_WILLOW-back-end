import mongoose, { Schema } from 'mongoose';
import { IContactMessage } from '../../entities/contact.entity';

const ContactMessageSchema: Schema = new Schema({
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  }, {
    timestamps: true
  });
  
  export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);