import { EventRepository } from "../respository/eventRepository";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import IEvent from "../entities/event.entity";

export class EventUseCase {

    constructor(private eventRepository: EventRepository) {
        this.eventRepository = eventRepository
    }
    async addEvent({ name, description, event_heading, event_content, event_services, event_features, image1, image2, image3 }: IEvent): Promise<IEvent> {
        const existingEvent = await this.eventRepository.findByName(name);

        if (existingEvent) {
            throw new Error('An event with the same name already exists.');
        }

        // Upload images to Cloudinary
        const image1Url = await uploadCloudinary(image1);
        const image2Url = await uploadCloudinary(image2);
        const image3Url = await uploadCloudinary(image3);

        // create a new event Object
        const newEvent: IEvent = {
            name,
            description,
            event_heading,
            event_content,
            event_services,
            event_features,
            image1: image1Url,
            image2: image2Url,
            image3: image3Url,
        };

        return this.eventRepository.add(newEvent);
    }

    async getAllEvents():Promise<IEvent[]>{
        return this.eventRepository.getEvents()
    }

    async eventStatus(event: IEvent): Promise<IEvent> {
        return this.eventRepository.updateEventStatus(event);
      }

    async updateEvent(id:string,updateData:IEvent):Promise<IEvent | null>{
        const event = await this.eventRepository.findById(id)

        if (!event) {
            throw new Error('Event not found');
          }

          return this.eventRepository.updateEvent(id,updateData)
    }
      
}

