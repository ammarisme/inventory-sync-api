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
}
