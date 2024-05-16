import { Controller, Delete, Get, Post, Body, Put, Param, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { AddTrackingStatus, CreateOrderDto, Order, OrderWithCustomFields, RevenueStatus, UpdateOrderNote, UpdateOrderStatusDto, UpdateTrackingDataDto, UpdateTrackingDto } from '../models/order/order.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { OrderService } from '../models/order/order.service';
import * as fs from 'fs/promises'; // Using promises for cleaner syntax 
import { error } from 'console';
import { OrderSourceService } from '../models/order_source/order-source.service';
import { OrderSource } from '../models/order_source/order-source.schema';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly service: OrderService,
    private readonly orderSourceService: OrderSourceService,
  ) {}

  @Post("/import")
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/', // Change this to your desired upload directory
        filename: (req, file, cb) => {
          randomBytes(16, (err, buffer) => {
            const randomFilename = buffer.toString('hex');
            cb(err, `${randomFilename}_daraz.csv`); // Assuming the file is CSV
          });
        },
      }),
    })
  )
  async uploadOrders(@UploadedFile() file: Express.Multer.File, @Body() body: { source: string }) {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    const { source } = body;
    if (source !== 'daraz') {
      return { message: 'Currently only Daraz imports are supported' };
    }

    const data = await fs.readFile(file.path, 'utf-8'); // Read file content
    const orders = this.service.parseDarazCsvData(data); // Parse the data based on your specific format

    var errors = []
    for(const order of orders){
      try{
        if(!(await this.service.findByOrderId(order.order_id))){
          if(!order.customer.phone || order.customer.phone== ""){
            errors.push(
              {
                "order_id" : order.order_id,
                'error_message': 'phone number required'
              }
            )
            continue;
          }
          this.service.create(order);
        }else{
          errors.push(
            {
              "order_id" : order.order_id,
              'error_message': 'object exists - ' + order.order_id
            }
          ) 
        }
        //await this.service.upsertOrderByOrderId(order.order_id as string, order);
      }catch(error){
        errors.push(
          {
            "order_id" : order.order_id,
            'error_message': error
          }
        )
      }
    }
    
    return { message: errors
     };
  }


  @Post()
  async create(@Body() orderCreateDto: CreateOrderDto) {
    try{
      if(!(await this.service.findByOrderId(orderCreateDto.order_id))){
        this.service.create(orderCreateDto);
      }else{
        return {
          'error_message': 'object exists - ' + orderCreateDto.order_id
        }
      } 
    }catch(e){
      return {
        'error_message':  e
      }
    }
    
  }
  @Post("/add-tracking-status") // Define the new endpoint for adding tracking status
  async addTrackingStatus(@Body() dto: AddTrackingStatus) {
    // You may want to add validation logic here if needed
    return this.service.addTrackingStatus(dto.order_id, dto);
  }

   // Controller function to search orders based on parameters
   @Get("/search")
   async searchOrders(
     @Query('customer_city') customerCity: string,
     @Query('customer_state') customerState: string,
     @Query('courier_id') courierId: string,
     @Query('source') source: string,
     @Query('order_status') order_status: string,
     @Query('search_text') search_text: string,
   ): Promise<Order[]> {

     // Call the service method to search orders based on the provided parameters
     return this.service.search(customerCity, customerState, courierId, source, order_status,search_text);
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

  @Put("/update-status-with-remark")
  async updateStatusWithRemark(@Body() dto: UpdateOrderStatusDto) {
    if((await this.service.findByOrderId(dto.order_id))){
      return this.service.updateOrderByIdWithRemark(dto.order_id, dto.status, dto.status_remark);
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

  @Put("/update-tracking-data")
  async updateTrackingData(@Body() dto: UpdateTrackingDataDto) {
    try{
    if((await this.service.findByOrderId(dto.order_id))){
      this.service.updateTrackingData(dto.order_id, dto.status, dto.revenue_status, dto.tracking_data);
      return {
        'status': 'ok',
        "id": dto.order_id
      }
    }else{
      return {
        'error_message': 'object doesnt exist'
      }
    }
  }catch(ex){
      throw ex
    }
  }

  @Put("/update-order-note")
  async updateOrderNote(@Body() dto: UpdateOrderNote) {
    if((await this.service.findByOrderId(dto.order_id))){
      return this.service.updateOrderNote(dto.order_id, dto.order_note);
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

 

  // orders/

  @Get("/by-status-with-custom-fields/:status")
  async findByStatusWithCustomFields(@Param("status") status: string): Promise<Order[]> {
    return this.service.findByStatusWithCustomFields(status);
  }

  @Get("/count-by-status")
  async countByStatus(): Promise<{ status: string, count: number }[]> {
    return this.service.countOrdersByStatus();
  }

  @Get("/by-order-id/:order_id")
  async findById(@Param("order_id") order_id: string): Promise<OrderWithCustomFields> {
    return this.service.findByOrderIdWithCustomFields(order_id);
  }

  @Get("/by-tracking-number/:tracking_number")
  async findByTrackingNumber(@Param("tracking_number") tracking_number: string): Promise<OrderWithCustomFields> {
    return this.service.findByTrackingNumberWithCustomFields(tracking_number);
  }

  @Post('update-orders-status/:status')
  async addOrdersToJourney(@Param('status') status: string, @Body() data) {
    try {
      const result = await this.service.updateOrdersStatus(status, data.orderIds);
      return result;
    } catch (error) {
      console.error(error);
      return { error: 'Failed to add orders to journey' };
    }
  }

  @Post('/ship-orders')
  async shipOrders(@Body() data) {
    try {
      // Validate incoming data
      if (!data || !data.courier || !data.orderIds || !Array.isArray(data.orderIds)) {
        throw new Error('Invalid data provided');
      }
  
      // Call the service to ship orders
      const result = await this.service.shipOrders(data.courier, data.orderIds);
  
      // Return successful result
      return { success: true, result };
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in shipping orders:', error);
  
      // Return an error response
      return { error: 'Failed to ship orders' };
    }
  }

  @Put('/update-returns')
  async updateReturns(@Body() data) {
    try {
      // Validate incoming data
      if (!data || !data.order_id || !data.return_items || !Array.isArray(data.return_items)) {
        throw new Error('Invalid data provided');
      }
  
      // Call the service to ship orders
      const result = await this.service.updateReturns(data.order_id,data.status, data.status_remark, data.return_items);
  
      // Return successful result
      return { success: true, result };
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in shipping orders:', error);
  
      // Return an error response
      return { error: 'Failed to ship orders' };
    }
  }

  //order source crud
  
  @Post("/order-source")
  async createOrderSource(@Body() orderSourceData: OrderSource) {
    return this.orderSourceService.create(orderSourceData);
  }

  @Get("/order-source")
  async findAllOrderSource(): Promise<OrderSource[]> {
    return this.orderSourceService.findAll();
  }

  @Get('/order-source/:id')
  async findOrderSourceById(@Param('id') id: string): Promise<OrderSource | null> {
    return this.orderSourceService.findById(id);
  }

  @Put('/order-source/:id')
  async updateOrderSourceById(@Param('id') id: string, @Body() newData: Partial<OrderSource>): Promise<OrderSource | null> {
    return this.orderSourceService.updateById(id, newData);
  }

  @Delete('/order-source:id')
  async deleteOrderSourceById(@Param('id') id: string): Promise<boolean> {
    return this.orderSourceService.deleteById(id);
  }

  @Get('/revenue-status/:status')
  async findByRevenueStatusWithCustomFields(@Param('status') status: string): Promise<Order[] | null> {
    return this.service.findByRevenueStatusWithCustomFields(status as RevenueStatus);
  }

  @Get('/revenue-status/:status')
  async findOrdersByRevenueStatus(@Param('status') status: string): Promise<Order[] | null> {
    return this.service.findOrdersByRevenueStatus(status as RevenueStatus);
  }
  
  @Get("/count-by-revenue-status")
  async countByRevenueStatus(): Promise<{ status: string, count: number }[]> {
    return this.service.countOrdersByRevenueStatus();
  } 


  @Put("/update-revenue-status")
  async updateOrderRevenueStatus(@Body() dto: UpdateOrderStatusDto) {
    if((await this.service.findByOrderId(dto.order_id))){
      return this.service.updateRevenueStatusById(dto.order_id, dto.status as RevenueStatus);
    }else{
      return {
        'error_message': 'object doesnt exist'
      }
    }
  }


 

  
  
}