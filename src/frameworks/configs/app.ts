import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRoute from "../router/userRouter";
import adminRouter from "../router/adminRouter";
import eventRouter from "../router/eventRouter";
import employeeRouter from "../router/employeeRouter";
import session from "express-session"
import packageRouter from "../router/packageRouter";
import foodRouter from "../router/foodRouter";
import galleryRouter from "../router/galleryRouter";
import bookingRouter from "../router/bookingRouter";
import bannerRouter from "../router/bannerRouter";
import chatRouter from "../router/chatRouter";




// Initialize Express application
const app = express();





// Load environment variables from .env
dotenv.config();


const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:4200' // Allow requests from Angular application on localhost
];

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


//session config
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'default_secret',
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));


// User route setting
app.use('/user', userRoute);

//admin route setting
app.use('/admin',adminRouter)

//event route setting
app.use('/event',eventRouter)

//employee route setting
app.use('/employee',employeeRouter)

//Packages route setting
app.use('/package',packageRouter)

//food Route Setting
app.use('/food',foodRouter)

//gallery Route settting
app.use('/gallery',galleryRouter)

//booking routeSetting
app.use('/booking',bookingRouter)

//banner routeSet
app.use('/banner',bannerRouter)

app.use('/chat',chatRouter)



export default app;
