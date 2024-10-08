import { Request, Response } from 'express';
import { AdminUseCase } from "../usecase/adminUseCase";
import { HttpStatusCode } from '../enums/httpStatusCodes';

export class AdminController {
    private adminUseCase: AdminUseCase
    constructor(adminUseCase: AdminUseCase) {
        this.adminUseCase = adminUseCase
    }


    async adminLogin(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const adminToken: string | null = await this.adminUseCase.execute(email, password);


        if (adminToken) {
            res.cookie('adminToken', adminToken, {
                httpOnly: true,
                secure: process.env.NODE_Env === 'production',
                maxAge: 3600000,
                sameSite: 'strict',
            })
            res.status(HttpStatusCode.OK).json({ message: 'Login successful' });
        } else {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Invalid email or password' });
        }
    }


    async adminLogout(req: Request, res: Response): Promise<void> {
        this.adminUseCase.executeLogout();

        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        res.status(HttpStatusCode.OK).json({ message: 'Logout successful' });
    }

    
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;

            const { users, totalItems } = await this.adminUseCase.getAllUsers(page, limit);

            res.json({
                users,
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit)
            });
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }

    async getEvents(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;
            const events = await this.adminUseCase.getEvents(page, itemsPerPage);
            res.json(events);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
        }
    }
    

    async UpdateUserStatus(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body
            const updateUser = await this.adminUseCase.updateStatus(user);
            res.status(HttpStatusCode.OK).json(updateUser)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update user status' });
        }
    }

    async onSearch(req: Request, res: Response) {
        const searchTerm = req.query.searchTerm as string
        try {
            const searchResult = await this.adminUseCase.onSerch(searchTerm)
            res.json(searchResult)
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error searching users' });
        }
    }

    async isAuth(req:Request,res:Response){
        res.status(HttpStatusCode.OK).json({message:"Success"})
    }

    async getDashBoardData(req:Request,res:Response){
        try {
            const dashboardData = await this.adminUseCase.getDashBoardDetails()
            res.status(HttpStatusCode.OK).json(dashboardData)
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching dashboard Data', error });
        }
    }


    async getDailyBookings(req: Request, res: Response) {
        try {
          const dailyBookings = await this.adminUseCase.getDailyBookings();
          
          res.status(HttpStatusCode.OK).json(dailyBookings);
        } catch (error) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching daily bookings', error });
        }
      }
    
      async getMonthlyBookings(req: Request, res: Response) {
        try {
          const monthlyBookings = await this.adminUseCase.getMonthlyBookings();
          res.status(HttpStatusCode.OK).json(monthlyBookings);
        } catch (error) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching monthly bookings', error });
        }
      }
    
      async getYearlyBookings(req: Request, res: Response) {
        try {
          const yearlyBookings = await this.adminUseCase.getYearlyBookings();
          res.status(HttpStatusCode.OK).json(yearlyBookings);
        } catch (error) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching yearly bookings', error });
        }
      }

    async getBookings(req: Request, res: Response): Promise<void> {
        try {
          const { startDate, endDate} = req.query;
      
          if (!startDate || !endDate ) {
            res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Missing query parameters' });
            return;
          }
      
          const { bookings } = await this.adminUseCase.getBookingData({
              startDate: startDate as string,
              endDate: endDate as string,
              statusFilter: ''
          });
          res.json({ bookings });
        } catch (error) {
          console.error('Error in getBookings controller:', error);
         
        }
      
    }

    async exportBookings(req: Request, res: Response): Promise<void> {
        try {
          const { startDate, endDate } = req.query as { startDate: string; endDate: string };
          if (!startDate || !endDate) {
            res.status(400).send('Start date and end date are required');
            return;
          }
          const fileBuffer = await this.adminUseCase.exportBookingsData(startDate, endDate);
          // Convert the Uint8Array to a Buffer before sending it
          const buffer = Buffer.from(fileBuffer);
          res.send(buffer);
        } catch (error) {
          console.error('Error exporting bookings:', error);
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
      }
}