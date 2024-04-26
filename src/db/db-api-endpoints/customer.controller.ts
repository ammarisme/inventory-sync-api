import { Controller, Get, Post, Body, Put, Param, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto, Customer, CustomerPinDto } from '../models/customer/customer.schema';
import { CustomerService } from '../models/customer/customer.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return await this.customerService.findOne(id);
  }

  @Put(':customer_id/location') // Change the parameter name to 'customer_id'
  async updateLocation(@Param('customer_id') customerId: string, @Body() updateCustomerDto: CustomerPinDto): Promise<boolean> {
    // Find customer by customer_id
    const customer = await this.customerService.findByCustomerId(customerId);
    
    // Check if customer exists
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    // Update customer's location
    await this.customerService.updateLocation(updateCustomerDto);

    // Return true to indicate successful update
    return true;
  }
}
