export interface IDashboard {
    totalBookings: number;
    receivableAmount?: number;
    totalUsers: number;
    totalEvents: number;
}

export interface MonthlyBooking {
    month: string;
    bookings: number;
  }

  export interface DailyBooking {
    day: number;
    bookings: number;
}

export interface YearlyBooking {
    year: number;
    bookings: number;
}
