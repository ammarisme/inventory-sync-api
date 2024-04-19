import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order, CreateOrderDto } from './order.schema';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MODEL')
    private model: Model<Order>,
  ) {}

  async create(createCatDto: CreateOrderDto): Promise<Order> {
    const createdCat = new this.model(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Order[]> {
    return this.model.find().exec();
  }

  async findById(id: String): Promise<Order | null> {
    return this.model.findById(id).exec();
  }

  async findByOrderId(orderId: String): Promise<Order | null> {
    return this.model.findOne({ order_id: orderId }).exec();
  }

  async updateOrderById(orderId: String, status : String): Promise<boolean> {
    this.model.updateOne({ order_id: orderId }, {status : status}).exec();
    return true;
  }

  async updateTracking(order_id: String, courier_id : String, tracking_number: String): Promise<boolean> {
    this.model.updateOne({ order_id: order_id }, {courier_id : courier_id,tracking_number: tracking_number }).exec();
    return true;
  }
}