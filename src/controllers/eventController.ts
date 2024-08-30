import { Request, Response } from 'express';
import { EventUseCase } from '../usecase/eventUseCase';
import { HttpStatusCode } from '../enums/httpStatusCodes';

export class EventController {

    constructor(private eventUseCase: EventUseCase) {
        this.eventUseCase = eventUseCase
    }
    //adding new event

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
            res.status(HttpStatusCode.CREATED).json({ message: 'Event added successfully', event: newEvent });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error adding event' });
        }
    }

    //Fetching events
    async getAllEvents(req: Request, res: Response) {
        try {
            const Events = await this.eventUseCase.getAllEvents();
            
            res.status(HttpStatusCode.OK).json(Events)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Fetching events failed" });
        }
    }

    //event staus updating 
    async eventStatus(req: Request, res: Response): Promise<void> {
        try {
            const event = req.body;
            const updateEvents = await this.eventUseCase.eventStatus(event);
            res.status(HttpStatusCode.OK).json(updateEvents);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Updating event status failed" });
        }
    }


    async updateEventData(req:Request,res:Response):Promise<void>{
        
        const updateData = req.body
        const id = updateData._id

        try {
            const updateEvent = await this.eventUseCase.updateEvent(id,updateData)

            if(!updateEvent){
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
                return;
            }

            res.status(HttpStatusCode.OK).json(updateEvent)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "event data updation failed" });
        }
        
    }

    async getEventByName(req:Request,res:Response):Promise<void>{
      const name = req.params.name as string

      try {
        const event = await this.eventUseCase.getEventByName(name)
        if(event){
            res.json(event)
        }else{
            res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
        }
      } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving event', error });
      }
    }


    async onSearch(req: Request, res: Response) {
        const searchTerm = req.query.searchTerm as string;
        try {
          const searchResult = await this.eventUseCase.onSerch(searchTerm);
          res.json(searchResult);
        } catch (error) {
          console.error('Error searching users:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error searching event' });
        }
      }

}