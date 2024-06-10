import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Courier } from '../models/courier/courier.schema';
import { CourierService } from '../models/courier/courier.service';

@Controller('couriers')
export class CourierController {
  constructor(private readonly service: CourierService) {}

  @Post()
  async create(@Body() courierData: Courier) {
    return this.service.create(courierData);
  }

  @Get()
  async findAll(): Promise<Courier[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Courier | null> {
    return this.service.findById(id);
  } 

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() newData: Partial<Courier>): Promise<Courier | null> {
    return this.service.updateById(id, newData);
  }


}
