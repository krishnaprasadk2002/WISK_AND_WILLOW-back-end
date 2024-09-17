import { IChatMessage, IConversation } from "../entities/chat.entity";
import IUsers from "../entities/user.entity";
import { ChatRepository } from "../respository/chatRepository";

export class ChatUseCase {

  constructor(private chatRepository: ChatRepository) { }

  // Handle sending a message
  async sendMessage(conversationId: string, message: string): Promise<IConversation | null> {
    const mymessage:IChatMessage = {
      user: "user",
      message: message
    }
    return this.chatRepository.addMessageToConversation(conversationId, mymessage);
  }

  async adminSendMessage(conversationId: string, message: string): Promise<IConversation | null> {
    const mymessage:IChatMessage = {
      user: "admin",
      message: message
    }
    console.log(mymessage,"Koko");
    
    return this.chatRepository.addMessageToConversation(conversationId, mymessage);
  }


  // Fetch user details
  async getUserDetails(userId: string): Promise<IUsers | null> {
    return this.chatRepository.getUserById(userId);
  }

  // Fetch getChat
  async getChats(userId: string): Promise<any> {
    return this.chatRepository.getChat(userId)
  }

  async getConversationId(userId: string): Promise<IChatMessage> {
    const conversation = await this.chatRepository.getConverstionId(userId)
    

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  async getConversationData():Promise<IConversation[]>{
    const conversationData = await this.chatRepository.getConversationData()
    return conversationData
  }

}
