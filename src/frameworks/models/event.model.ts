import { model, Schema, Types } from "mongoose";
import IEvent from "../../entities/event.entity";

const eventSchema = new Schema<IEvent | undefined>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    event_heading: { type: String, required: true },
    event_content: { type: String, required: true },
    event_services: { type: String, required: true },
    event_features: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
}, { timestamps: true });

const Event = model<IEvent | undefined>('Event', eventSchema);
export default Event;
