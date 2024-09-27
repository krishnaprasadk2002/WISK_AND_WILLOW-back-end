import * as dotenv from 'dotenv'
import IUsers from '../entities/user.entity';
import userModel from '../frameworks/models/user.model'
import IEvent from '../entities/event.entity';
import Event from '../frameworks/models/event.model';
import Users from '../frameworks/models/user.model';
import { IAdminRepository } from '../interfaces/repositories/adminRepository';
import { DailyBooking, IDashboard, MonthlyBooking, YearlyBooking } from '../entities/dashboard.entity';
import BookingModel from '../frameworks/models/booking.model';
import IBooking from '../entities/booking.entity';
import moment from 'moment';
dotenv.config()

export class AdminRepository implements IAdminRepository {
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

    async updateUserStatus(user: IUsers): Promise<IUsers | null> {
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { status: user.status },
            { new: true }
        )

        return updatedUser
    }

    async getEvents(page: number, itemsPerPage: number): Promise<IEvent[]> {
        const skip = (page - 1) * itemsPerPage;
        return await Event.find()
            .skip(skip)
            .limit(itemsPerPage) as IEvent[]
    }

    async getEventCount(): Promise<number> {
        return await Event.countDocuments()
    }

    async onSearch(searchTerm: string): Promise<IUsers[]> {
        return await Users.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { mobile: { $regex: searchTerm, $options: 'i' } }
            ]
        })
    }



    //Dashboard
    async getDashboardDetails(): Promise<IDashboard> {

        // Total Bookings
        const totalBookings = await BookingModel.countDocuments({});

        // Receivable Amount Calculation
        const totalReceivableAmountData = await BookingModel.aggregate([
            { $match: { status: 'successful' } },
            {
                $group: {
                    _id: null,
                    totalReceivable: { $sum: "$balanceAmount" }
                }
            }
        ]);

        const receivableAmount = totalReceivableAmountData.length > 0 ? totalReceivableAmountData[0].totalReceivable : 0;

        // Total Users Calculation
        const totalUsers = await userModel.countDocuments({});

        //totalEvents
        const totalEvents = await Event.countDocuments({})
        console.log(totalEvents);


        return {
            totalBookings,
            receivableAmount,
            totalUsers,
            totalEvents
        };
    }
    
    // async getDashboardChart(): Promise<MonthlyBooking[]> {
       
    //   const monthlyBookings = await BookingModel.aggregate([
    //     {
    //       $group: {
    //         _id: { $month: "$created_at" },
    //         bookings: { $sum: 1 }
    //       }
    //     },
    //     {
    //       $sort: { "_id": 1 } 
    //     },
    //     {
    //       $project: {
    //         month: { 
    //           $let: {
    //             vars: {
    //               monthsInString: [ "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    //             },
    //             in: { $arrayElemAt: [ "$$monthsInString", "$_id" ] }
    //           }
    //         },
    //         bookings: 1
    //       }
    //     }
    //   ]);
      
    
    //   return monthlyBookings;
    // }


    async getMonthlyBookings(): Promise<MonthlyBooking[]> {
      return BookingModel.aggregate([
        {
          $group: {
            _id: { $month: "$created_at" },
            bookings: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        },
        {
          $project: {
            month: { 
              $let: {
                vars: {
                  monthsInString: [ "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
                },
                in: { $arrayElemAt: [ "$$monthsInString", "$_id" ] }
              }
            },
            bookings: 1
          }
        }
      ]);
    }
  
    // Method for daily bookings
    async getDailyBookings(): Promise<DailyBooking[]> {
      const Daily =  await BookingModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        {
          $project: {
            date: "$_id",
            totalAmount: 1,
            _id: 0,
          },
        },
      ]).sort({ date: 1 });
      console.log(Daily);
      return Daily
    }
  
    // Method for yearly bookings
    async getYearlyBookings(): Promise<YearlyBooking[]> {
      return BookingModel.aggregate([
        {
          $group: {
            _id: { $year: "$created_at" },
            bookings: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        },
        {
          $project: {
            year: "$_id",
            bookings: 1
          }
        }
      ]);
    }
  


      async getBookingsData(startDate: string, endDate: string): Promise<{ bookings: IBooking[] }> {
        const start = new Date(startDate);
        const end = new Date(endDate);
      
        console.log('Parsed Start Date:', start);
        console.log('Parsed End Date:', end);
      
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error('Invalid date format');
        }
      
        const bookings = await BookingModel.find({
          created_at: { $gte: start, $lte: end },
        });
      
        return { bookings };
      }
      
      

}

export default new AdminRepository();