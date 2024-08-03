import express from "express";

import { EventRepository } from "../../respository/eventRepository";
import { EventUseCase } from "../../usecase/eventUseCase";
import { EventController } from "../../controllers/eventController";

const evnetRouter = express()

const eventRepository = new EventRepository()
const eventUseCase = new EventUseCase(eventRepository)
const eventController = new EventController(eventUseCase)

evnetRouter.post('/addevent',(req,res)=>eventController.addEvent(req,res))

export default evnetRouter