import * as dotenv from 'dotenv'
import IUsers from '../entities/user.entity';
import userModel from '../frameworks/models/user.model'
import IEvent from '../entities/event.entity';
import Event from '../frameworks/models/event.model';
import Users from '../frameworks/models/user.model';
dotenv.config()

export class AdminRepository {
    constructor() { }

    getAdminEmail(): string {
        return process.env.ADMIN_EMAIL || '';
    }

    getAdminPassword(): String {
        return process.env.ADMIN_PASSWORD || '';
    }

    getJwtSecret(): string {
        return process.env.JWT_SECRET || 'wiskandwillow';
    }

    async getAllUsers(limit: number, skip: number): Promise<IUsers[]> {
        return Users.find().limit(limit).skip(skip);
    }

    async countAllUsers(): Promise<number> {
        return Users.countDocuments();
    }

    async updateUserStatus(user:IUsers):Promise<IUsers | null>{
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {status:user.status},
        {new:true}
      )

      return updatedUser
    }

    async getEvents(page: number, itemsPerPage: number): Promise<IEvent[]> {
        const skip = (page - 1) * itemsPerPage;
        return await Event.find()
        .skip(skip)
        .limit(itemsPerPage) as IEvent[]
    }

    async getEventCount():Promise<number>{
        return await Event.countDocuments()
    }

    async onSearch(searchTerm:string):Promise<IUsers[]>{
        return await Users.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { mobile: { $regex: searchTerm, $options: 'i' } }
            ]
        })
    }
}

export default new AdminRepository();