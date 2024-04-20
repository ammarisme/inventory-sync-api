import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order, CreateOrderDto, AddTrackingStatus } from './order.schema';

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

  async findOrdersByStatus(status : String): Promise<Order[]> {
    return this.model.find({status: status}).exec();
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

  async addTrackingStatus(order_id: String, trackingStatus: AddTrackingStatus): Promise<boolean> {
    try {
      const order = await this.model.findOne({ order_id }).exec();
      if (!order) {
        throw new Error(`Order with ID ${order_id} not found`);
      }
  
      // Check if the message already exists in the tracking_status array
      const messageExists = order.tracking_status.some(status => status.message === trackingStatus.message);
      if (messageExists) {
        // If the message already exists, return false indicating that it wasn't added
        return false;
      }
  
      // If the message doesn't exist, push the new trackingStatus object
      order.tracking_status.push(trackingStatus);
      await order.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}