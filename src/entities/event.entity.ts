import { ObjectId } from "mongoose";

export interface IEvent {
    _id?: ObjectId;
    name: string;
    description: string;
    event_heading: string;
    event_content: string;
    event_services: string;
    event_features: string;
    image1: string;
    image2: string;
    image3: string;
    status?:boolean;
}

export default IEvent;
