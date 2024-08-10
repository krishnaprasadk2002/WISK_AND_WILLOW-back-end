import express from "express";
import { EventRepository } from "../../respository/eventRepository";
import { EventUseCase } from "../../usecase/eventUseCase";
import { EventController } from "../../controllers/eventController";

const eventRouter = express()

const eventRepository = new EventRepository()
const eventUseCase = new EventUseCase(eventRepository)
const eventController = new EventController(eventUseCase)

eventRouter.post('/addevent',(req,res)=>eventController.addEvent(req,res))
eventRouter.get('/getevents', (req, res) => eventController.getAllEvents(req, res));
eventRouter.post('/eventstatus', (req, res) => eventController.eventStatus(req, res));
eventRouter.put('/editevent', (req,res) => eventController.updateEventData(req,res))
eventRouter.get('/getEventByName/:name',(req,res)=>eventController.getEventByName(req,res))

export default eventRouter