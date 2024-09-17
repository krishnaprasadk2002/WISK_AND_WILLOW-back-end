import { IDashboard, MonthlyBooking } from "../../entities/dashboard.entity"
import IEvent from "../../entities/event.entity"
import IUsers from "../../entities/user.entity"

export interface IAdminRepository{

    getAdminEmail(): string 
    getAdminPassword(): String
    getJwtSecret(): string
    getAllUsers(limit: number, skip: number): Promise<IUsers[]>
    countAllUsers(): Promise<number>
    updateUserStatus(user:IUsers):Promise<IUsers | null>
    getEvents(page: number, itemsPerPage: number): Promise<IEvent[]>
    getEventCount():Promise<number>
    onSearch(searchTerm:string):Promise<IUsers[]>
    getDashboardDetails(): Promise<IDashboard>
    getDashboardChart(): Promise<MonthlyBooking[]> 
}