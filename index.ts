import { createServer } from "http";
import app from "./src/frameworks/configs/app";


const server = createServer(app)


const PORT = process.env.PORT || 9000

server.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
    
})