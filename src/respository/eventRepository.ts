import IBanner from "../entities/banner.entity";
import IEvent from "../entities/event.entity";
import Banner from "../frameworks/models/banner.model";
import Event from "../frameworks/models/event.model";
import { IEventRepository } from "../interfaces/repositories/eventRepository";

export class EventRepository implements IEventRepository {

  constructor() { }

  async findByName(name: string): Promise<IEvent | null> {
    return Event.findOne({ name });
  }

  async add(eventData: IEvent): Promise<IEvent> {
    const newEvent = new Event(eventData);
    return newEvent.save();
  }

  async getEvents(): Promise<IEvent[]> {
    return Event.find({ status: { $ne: true } });
  }

  async updateEventStatus(event: IEvent): Promise<IEvent> {
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { status: event.status },
      { new: true }
    ).exec();
    return updatedEvent as IEvent;
  }

  async findById(id: string): Promise<IEvent | null> {
    return Event.findById(id).exec()
  }

  async updateEvent(id: string, updateData: IEvent): Promise<IEvent | null> {
    for (let key in updateData) {
      if (updateData[key as keyof IEvent] === undefined) {
        delete updateData[key as keyof IEvent];
      }
    }
    console.log(updateData, "UPP");

    return Event.findByIdAndUpdate(id, updateData).exec()
  }

  async getEventByName(name: string): Promise<IEvent | null> {
    return Event.findOne({ name })
  }


  async onSearch(searchTerm: string): Promise<IEvent[]> {
    return await Event.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } }
      ]
    })
  }

  async getBanners(): Promise<IBanner[]> {
    return await Banner.find({ status: false })
  }
}
