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
}


