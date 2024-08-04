import IEvent from "../entities/event.entity";
import Event from "../frameworks/models/event.model";

export class EventRepository  {

    constructor(){}
       
    async findByName(name: string) {
        return Event.findOne({name});
    }

    async add(eventData: IEvent): Promise<IEvent> {
        const newEvent = new Event(eventData);
        return newEvent.save();
    }

    async getEvents():Promise<IEvent[]>{
        return Event.find()
    }

    async updateEventStatus(event: IEvent): Promise<IEvent> {
        const updatedEvent = await Event.findByIdAndUpdate(
          event._id,
          { status: event.status },
          { new: true }
        ).exec();
        return updatedEvent as IEvent;
      }

    async findById(id:string):Promise<IEvent | null>{
        return Event.findById(id).exec()
    }

    async updateEvent(id:string,updateData:IEvent):Promise<IEvent | null > {
      return Event.findByIdAndUpdate(id,updateData).exec()
    }
    
    }
