import express from "express";
import { EventRepository } from "../../respository/eventRepository";
import { EventUseCase } from "../../usecase/eventUseCase";
import { EventController } from "../../controllers/eventController";
import { adminAuthMiddleware } from "../middlewares/adminAuthentication";

const eventRouter = express()

const eventRepository = new EventRepository()
const eventUseCase = new EventUseCase(eventRepository)
const eventController = new EventController(eventUseCase)

eventRouter.post('/addevent',(req,res)=>eventController.addEvent(req,res))
eventRouter.get('/getevents', (req, res) => eventController.getAllEvents(req, res));
eventRouter.post('/eventstatus', (req, res) => eventController.eventStatus(req, res));
eventRouter.put('/editevent', (req,res) => eventController.updateEventData(req,res))
eventRouter.get('/getEventByName/:name',(req,res)=>eventController.getEventByName(req,res))
eventRouter.get('/search',adminAuthMiddleware,(req,res)=>eventController.onSearch(req,res))
eventRouter.get('/getbanners',(req,res)=>eventController.getBanners(req,res))

export default eventRouter