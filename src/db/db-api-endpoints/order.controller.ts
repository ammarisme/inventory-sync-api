import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { AddTrackingStatus, CreateOrderDto, Order, UpdateOrderStatusDto, UpdateTrackingDto } from '../models/order/order.schema';
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
  @Post("/add-tracking-status") // Define the new endpoint for adding tracking status
  async addTrackingStatus(@Body() dto: AddTrackingStatus) {
    // You may want to add validation logic here if needed
    return this.service.addTrackingStatus(dto.order_id, dto);
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

  @Get("/by-status/:status")
  async findByStatus(@Param("status") status: string): Promise<Order[]> {
    return this.service.findOrdersByStatus(status);
  }
}