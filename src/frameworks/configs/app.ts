import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRoute from "../router/userRouter";
import adminRouter from "../router/adminRouter";

// Initialize Express application
const app = express();

// Load environment variables from .env
dotenv.config();

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:4200' // Allow requests from Angular application on localhost
];

// Enable CORS
app.use(cors({
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true
}));

// User route setting
app.use('/user', userRoute);

//admin route setting
app.use('/admin',adminRouter)


export default app;
