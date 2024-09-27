import { Request, Response, NextFunction } from 'express';

const setDownloadHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Disposition', 'attachment; filename="booking_reports.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  next();
};

export default setDownloadHeaders;
