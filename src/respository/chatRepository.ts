import mongoose from "mongoose";
import { IConversation, IChatMessage } from "../entities/chat.entity";
import Conversation from "../frameworks/models/chat.model";
import Users from "../frameworks/models/user.model";
import IUsers from "../entities/user.entity";
import { v4 as uuidv4 } from 'uuid';

export class ChatRepository {

   // Fetch conversation by participants
   async getConversationByParticipants(participants: string[]): Promise<IConversation | null> {
    return Conversation.findOne({ participants: { $all: participants } })
  }

  // Save a new message in the conversation
async addMessageToConversation(conversationId: string, message: IChatMessage): Promise<IConversation | null> {
  return Conversation.findOneAndUpdate(
      { conversationid: conversationId }, 
      { $push: { messages: message } },   
      { new: true }                      
  );
}


  // Fetch user details
  async getUserById(userId: string): Promise<IUsers | null> {
    return Users.findById(userId)
  }

  async getChat(userId:string):Promise<any>{
    
    let conversation = await Conversation.findOne({participants: userId })

    if(!conversation){
      const newConversation = new Conversation({
        conversationid:uuidv4(),
        participants:[userId],
        messages:[]
      })

      conversation = await newConversation.save()
    }
    return conversation
  }

  async getConverstionId(userId: string): Promise<any> {
    const conversation = await Conversation.findOne({ participants: userId })
    return conversation;
  }

  async getConversationData(): Promise<IConversation[]> {
      const documents = await Conversation.find().populate('participants');
      return documents as unknown as IConversation[];
  }
  
}