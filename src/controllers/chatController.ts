import { Request, Response } from "express";
import { authenticatedRequest } from "../frameworks/middlewares/authenticateToken";
import { ChatUseCase } from "../usecase/chatUseCase";
import { HttpStatusCode } from "../enums/httpStatusCodes";

export class ChatController {
  constructor(private chatUseCase: ChatUseCase) { }

  async handleNewMessage(socket: any, conversationId: string, message: string) {
    const updatedConversation = await this.chatUseCase.sendMessage(conversationId, message);
    // socket.to(conversationId).emit('adminMessage', { conversationId, message });
    socket.emit('message-from-user', { conversationId, message });
  }

  async handleAdminNewMessage(socket: any, conversationId: string, message: string) {
    const updatedConversation = await this.chatUseCase.adminSendMessage(conversationId, message);
    console.log(conversationId,"TOO");
    
    socket.to(conversationId).emit('adminMessage', { conversationId, message });
  }

  async getChats(req: authenticatedRequest, res: Response) {
    const userId = req.user?.userId as string;
    if (userId) {
      try {
        const conversation = await this.chatUseCase.getChats(userId)

        return res.status(HttpStatusCode.OK).json(conversation)
      } catch (error) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get or create conversation', error });
      }
    } else {
      return res.status(HttpStatusCode.FORBIDDEN).json({ message: 'User ID not provided' });
    }

  }

  async getConversationId(req: authenticatedRequest, res: Response) {
    const userId = req.user?.userId as string;
    console.log(userId, 'fetching conversation');
 
    try {
       const conversationId = await this.chatUseCase.getConversationId(userId);
       if (!conversationId) {
          console.log('Conversation not found for user:', userId);
          return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Conversation not found' });
       }
       return res.status(HttpStatusCode.OK).json(conversationId);
    } catch (error) {
       console.error('Error fetching conversation:', error);
       return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching conversation', error });
    }
 }
 

  async getConversationData(req:Request,res:Response){
    try {
      const conversationData = await this.chatUseCase.getConversationData()
      res.status(HttpStatusCode.OK).json(conversationData)
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching conversation', error });
    }
  }
}
