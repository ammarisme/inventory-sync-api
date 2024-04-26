import { Model } from 'mongoose';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto, Customer, CustomerPinDto } from './customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CUSTOMER_MODEL') // Inject the Customer model
    private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return await createdCustomer.save();
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async findByCustomerId(customerId: string): Promise<Customer> {
    const customer = await this.customerModel.findOne({ customer_id: customerId }).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async updateLocation(dto: CustomerPinDto): Promise<boolean> {
    const existingCustomer = await this.customerModel.findOneAndUpdate(
      { customer_id: dto.customer_id },
      { pin: dto },
      { new: true }
    ).exec();

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }
    
    return true;
  }

}
