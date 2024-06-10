import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrderSourceService } from '../models/order_source/order-source.service';
import { OrderSource } from '../models/order_source/order-source.schema';

@Controller('order-sources')
export class OrderSourceController {
  constructor(private readonly orderSourceService: OrderSourceService) {}

  @Post()
  async create(@Body() orderSourceData: OrderSource): Promise<OrderSource> {
    return this.orderSourceService.create(orderSourceData);
  }

  @Get()
  async findAll(): Promise<OrderSource[]> {
    return this.orderSourceService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') orderSourceId: string): Promise<OrderSource | null> {
    return this.orderSourceService.findById(orderSourceId);
  }

  @Patch(':id')
  async updateById(@Param('id') orderSourceId: string, @Body() newData: Partial<OrderSource>): Promise<OrderSource | null> {
    return this.orderSourceService.updateById(orderSourceId, newData);
  }


}
