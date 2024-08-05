import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRoute from "../router/userRouter";
import adminRouter from "../router/adminRouter";
import eventRouter from "../router/eventRouter";
import employeeRouter from "../router/employeeRouter";

// Initialize Express application
const app = express();

// Load environment variables from .env
dotenv.config();



const allowedOrigins = [
  'http://localhost:4200' // Allow requests from Angular application on localhost
];

// Enable CORS
// Apply CORS configuration immediately after initializing the app
app.use(cors({
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true
}));

// Parse incoming URL-encoded form data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser())



// User route setting
app.use('/user', userRoute);

//admin route setting
app.use('/admin',adminRouter)

//event route setting
app.use('/event',eventRouter)

//employee route setting
app.use('/employee',employeeRouter)


export default app;
