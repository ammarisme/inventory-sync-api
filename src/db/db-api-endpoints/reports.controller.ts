import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ReportService } from 'src/db/models/reports/reports.service';
import { RiderReport } from '../models/reports/reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportService) {}


  @Get('/rider_report')
  async getRiderReport(
    @Query('rider') rider: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<RiderReport> {
    // Assuming the Report schema and ReportService have the necessary methods
    return this.service.riderReport( rider, startDate, endDate );
  }

  @Get('/rider_report_detail')
  async detailedRiderReport(
    @Query('rider') rider: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<RiderReport> {
    // Assuming the Report schema and ReportService have the necessary methods
    return this.service.detailedRiderReport( rider, startDate, endDate );
  }


  

  
  @Get("/group-by-source")
  async groupBySource(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      return { error: 'startDate and endDate are required' };
    }

    try {
      const orders = await this.service.groupBySource(new Date(startDate), new Date(endDate));
      return orders;
    } catch (err) {
      console.error(err);
      return { error: 'Internal Server Error' };
    }
  }
}
