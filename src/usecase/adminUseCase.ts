import jwt from "jsonwebtoken"
import { AdminRepository } from "../respository/adminRepository"
import  {EventRepository}  from "../respository/eventRepository"
import IUsers from "../entities/user.entity"
import IEvent from "../entities/event.entity"
import { IAdminRepository } from "../interfaces/repositories/adminRepository"
import { IDashboard, MonthlyBooking } from "../entities/dashboard.entity"
import IBooking from "../entities/booking.entity"
import * as exceljs from 'exceljs';

interface GetBookingsRequest {
    startDate: string;
    endDate: string;
    statusFilter: string;
  }

export class AdminUseCase{
    constructor(private eventRepository: EventRepository,private adminRep:IAdminRepository){
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


    //DashBoard
    async getDashBoardDetails():Promise<IDashboard>{
        const dashBoardData = await this.adminRep.getDashboardDetails()
        return dashBoardData
    }

    //dashBoardCahrt

    async getDashBoardChart():Promise<MonthlyBooking[]>{
      return this.adminRep.getDashboardChart()
    }

    async getBookingData(data: GetBookingsRequest): Promise<{ bookings: IBooking[] }> {
        const { startDate, endDate} = data;
        return await this.adminRep.getBookingsData(startDate, endDate);
      }
    

      async exportBookingsData(startDate: string, endDate: string): Promise<Buffer> {
        // Fetch bookings data
        const result = await this.adminRep.getBookingsData(startDate, endDate);
        const bookings: IBooking[] = result.bookings;
    
        // Create Excel file
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Bookings');
    
        worksheet.columns = [
          { header: 'Customer Name', key: 'customerName', width: 25 },
          { header: 'Event Type', key: 'eventType', width: 20 },
          { header: 'Amount', key: 'amount', width: 15 }
        ];
    
        bookings.forEach((booking: IBooking) => {
          worksheet.addRow({
            customerName: booking.name,
            eventType: booking.type_of_event,
            amount: booking.totalAmount
          });
        });
    
        // Use writeBuffer to generate the Excel file buffer (Uint8Array)
        const uint8ArrayBuffer = await workbook.xlsx.writeBuffer();
    
        // Convert Uint8Array to Buffer
        const buffer = Buffer.from(uint8ArrayBuffer);
    
        // Return as Buffer
        return buffer;
      }
    }
      
