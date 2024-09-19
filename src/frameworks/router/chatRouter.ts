import { ChatRepository } from "../../respository/chatRepository";
import { ChatUseCase } from "../../usecase/chatUseCase";
import { ChatController } from "../../controllers/chatController";
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";

const chatRouter = express()

const chatRep = new ChatRepository()
const chatUseCase = new ChatUseCase(chatRep)
const chatController = new ChatController(chatUseCase)

// get conversation by userid - find conversation with userid else create new conversation.
chatRouter.get('/getchats',authenticateToken,(req,res)=>chatController.getChats(req,res))
chatRouter.get('/conversation',authenticateToken, (req, res) => chatController.getConversationId(req, res));
// get conversations for admin - find all conversation.
chatRouter.get('/getconversationdata',(req,res)=>chatController.getConversationData(req,res))



export default chatRouter;