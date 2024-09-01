import jwt from "jsonwebtoken"
import { AdminRepository } from "../respository/adminRepository"
import  {EventRepository}  from "../respository/eventRepository"
import IUsers from "../entities/user.entity"
import IEvent from "../entities/event.entity"

export class AdminUseCase{
    constructor(private eventRepository: EventRepository,private adminRep:AdminRepository){
        this.eventRepository = eventRepository
    }

    async execute(email:string,password:string):Promise<string | null>{
        const adminEmail = this.adminRep.getAdminEmail()
        const adminPassword = this.adminRep.getAdminPassword()
        const jwtSecret = this.adminRep.getJwtSecret();

        console.log(adminEmail,adminPassword);
        console.log(email, password);
        

        if(email === adminEmail && password === adminPassword){
            const adminToken = jwt.sign({email},jwtSecret,{expiresIn:'30d'})
            return adminToken
        }
        return null
    }

     executeLogout():void{

    }

    async getAllUsers(page: number, limit: number): Promise<{ users: IUsers[], totalItems: number }> {
        const skip = (page - 1) * limit;
        const users = await this.adminRep.getAllUsers(limit, skip);
        const totalItems = await this.adminRep.countAllUsers();

        return { users, totalItems };
    }

    async updateStatus(user:IUsers):Promise<IUsers | null>{
        return this.adminRep.updateUserStatus(user)
    }

    async getEvents(page: number, itemsPerPage: number): Promise<{ event: IEvent[], totalItems: number }> {
        const event = await this.adminRep.getEvents(page,itemsPerPage)
        const totalItems = await this.adminRep.getEventCount()
        return {event,totalItems}
    }

    async onSerch(searchTerm:string):Promise<IUsers[]>{
        return this.adminRep.onSearch(searchTerm)
    }
}