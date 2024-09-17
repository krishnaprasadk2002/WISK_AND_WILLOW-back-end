import IEvent from "../../entities/event.entity";

export interface IEventRepository{
    findByName(name: string):Promise<IEvent | null> 
    add(eventData: IEvent): Promise<IEvent>
    getEvents(): Promise<IEvent[]>
    updateEventStatus(event: IEvent): Promise<IEvent>
    findById(id:string):Promise<IEvent | null>
    updateEvent(id:string,updateData:IEvent):Promise<IEvent | null >
    getEventByName(name:string):Promise<IEvent | null >
    onSearch(searchTerm:string):Promise<IEvent[]>
}