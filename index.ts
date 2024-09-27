import { createServer } from "http";
import app from "./src/frameworks/configs/app";
import connectDB from "./src/frameworks/configs/db";
import { Server } from "socket.io";
import { ChatController } from "./src/controllers/chatController";
import { ChatUseCase } from "./src/usecase/chatUseCase";
import { ChatRepository } from "./src/respository/chatRepository";

// Connect to Database
connectDB();

// Create HTTP server and attach Express app to it
const server = createServer(app);
//Instance of socket.io
export const io = new Server(server,{
  cors:{
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods:["GET",'POST'],
    credentials: true
  }
})

// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Set up repository, use case, and controller
const chatRepository = new ChatRepository();
const chatUseCase = new ChatUseCase(chatRepository);
const chatController = new ChatController(chatUseCase);



io.on("connection", (client) => {
  console.log("A new user has connected", client.id);

  client.on("new-message", (message) => {
    
    console.log(`Message from ${message.user}: ${message.message}`);
// new messgae push 
    chatController.handleNewMessage(io,message.conversationId,message.message)
    io.emit('message', { user: message.user, message: message });
  });

 client.on('admin-message',(message)=>{
  console.log(`Message from ${message.user}: ${message.message}`);
  chatController.handleAdminNewMessage(io,message.conversationId,message.message)
 })
 client.on('join-conversation',(conversationId)=>{
  console.log(`Joinedd ${conversationId.conversationId}`);
  const cid = conversationId.conversationId
  client.join(cid)
 })
});






