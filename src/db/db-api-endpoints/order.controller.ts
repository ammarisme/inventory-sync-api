import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { CreateOrderDto, Order, UpdateOrderStatusDto, UpdateTrackingDto } from '../models/order/order.schema';
import { OrderService } from '../models/order/order.service';


@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  async create(@Body() orderCreateDto: CreateOrderDto) {
    if(!(await this.service.findByOrderId(orderCreateDto.order_id))){
      return this.service.create(orderCreateDto);
    }else{
      return {
        'error_message': 'object exists'
      }
    }
  }

  @Put("/update-status")
  async updateStatus(@Body() dto: UpdateOrderStatusDto) {
    if((await this.service.findByOrderId(dto.order_id))){
      return this.service.updateOrderById(dto.order_id, dto.status);
    }else{
      return {
        'error_message': 'object doesnt exist'
      }
    }
  }

  @Put("/update-tracking")
  async updateTracking(@Body() dto: UpdateTrackingDto) {
    if((await this.service.findByOrderId(dto.order_id))){
      return this.service.updateTracking(dto.order_id, dto.courier_id, dto.tracking_number);
    }else{
      return {
        'error_message': 'object doesnt exist'
      }
    }
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.service.findAll();
  }
}