import express,{Request,Response} from "express";
import dotenv from "dotenv";
import cors from "cors";

//initialize Express application
const app = express();

// Load environment variables from .env 
dotenv.config()

//parse incoming url encoded form data
app.use(express.urlencoded({extended:true}))
const allowedOrgins = 
    'http://localhost:4200' // allow req form angular application on localhost

//enable cors
app.use(cors({
    origin:allowedOrgins,
    optionsSuccessStatus:200,
    credentials:true
}))


export default app