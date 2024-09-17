import mongoose from 'mongoose';
import { IChatMessage } from '../../entities/chat.entity';

// Define the schema for individual messages
const chatMessageSchema = new mongoose.Schema<IChatMessage>({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  conversationid:{type:String},
  participants: [{ type: mongoose.Types.ObjectId, ref: 'Users', required: true }], 
  messages: [chatMessageSchema] 
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
