import { Request, Response } from 'express';
import { EventUseCase } from '../usecase/eventUseCase';

export class EventController {

    constructor(private eventUseCase: EventUseCase) {
        this.eventUseCase = eventUseCase
    }

    async addEvent(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, event_heading, event_content, event_services, event_features, image1, image2, image3 } = req.body;
            const newEvent = await this.eventUseCase.addEvent({
                name,
                description,
                event_heading,
                event_content,
                event_services,
                event_features,
                image1,
                image2,
                image3
            })
            res.status(201).json({ message: 'Event added successfully', event: newEvent });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding event' });
        }
    }
}