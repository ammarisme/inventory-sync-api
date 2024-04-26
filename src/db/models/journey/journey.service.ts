import { Model, Types } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Journey, JourneyModel } from './journey.schema';
import { Order, OrderStatuses } from '../order/order.schema';
import { User } from '../user/user.schema';

@Injectable()
export class JourneyService {
  
  constructor(
    @Inject('JOURNEY_MODEL')
    private model: Model<Journey>,
    @Inject('ORDER_MODEL') // Inject the Order model
    private orderModel: Model<Order>,
    @Inject('USER_MODEL') // Inject the Order model
    private userModel: Model<User>,
  ) {}
  

  async create(journeyData: Journey): Promise<Journey> {
    const createdJourney = new this.model(journeyData);
    return createdJourney.save();
  }

  async findAll(): Promise<Journey[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<Journey | null> {
    return this.model.findById(id).exec();
  }

  async updateStatus(journeyId: string, status: string): Promise<boolean> {
    try {
      await this.model.updateOne({ _id: journeyId }, { status }).exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateOrders(journeyId: string, orderIds: string[]): Promise<Object> {
    try {
      let journey = await this.model.findById(journeyId).exec();
      if (!journey) {
        // If journey doesn't exist, create a new one
        journey = await this.model.create({ _id: journeyId, orders: [] });
        if (!journey) {
          throw new Error(`Failed to create journey with ID ${journeyId}`);
        }
      }
  
      // Retrieve order documents corresponding to the orderIds
      const orders = await Promise.all(orderIds.map(id => 
        this.orderModel.findOne({ order_id: id }).exec()));
  
      // Extract the _id properties from the order documents
      const objectIds = orders.map(order => order?._id);
  
      // Add each order _id to the journey's orders array
      objectIds.forEach(orderId => {
        if (!journey.orders.includes(orderId)) {
          journey.orders.push(orderId);
        }
      });

       // Update order statuses to "allocated"
       await Promise.all(orderIds.map(order_id =>
        this.orderModel.updateOne({ order_id: order_id }, { status: OrderStatuses.shipping_scheduled }).exec()
      ));
  
      await journey.save();
      return journey;
    } catch (error) {
      console.error(error);
      return {"eror" : error};
    }
    }
    
  async startJourney(journeyId: string): Promise<boolean> {
    try {
      const currentDate = new Date();
      
      // Update journey status and timestamps
      await this.model.updateOne({ _id: journeyId }, 
        {
          status: "ongoing",
          startDate: currentDate,
          createdAt: currentDate,
          updatedAt: currentDate,
        }).exec();
  
      // Retrieve orders associated with the journey
      const journey = await this.model.findById(journeyId).populate('orders').exec();
      if (!journey) {
        throw new Error(`Journey with ID ${journeyId} not found`);
      }
  
      // Update status of each order to "shipped"
      const orderIds = journey.orders.map(order => order._id);
      await this.orderModel.updateMany({ _id: { $in: orderIds } }, { status: "shipped" }).exec();
  
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async endJourney(journeyId: string): Promise<boolean> {
    try {
      const currentDate = new Date();
      
      // Update journey status and timestamps
      await this.model.updateOne({ _id: journeyId }, 
        {
          status: "completed",
          endDate: currentDate,
          updatedAt: currentDate,
        }).exec();
  
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  
  async getJourney(journeyId: string): Promise<Journey> {
    try {
      // Find the journey by ID and populate the "orders" field to get all associated orders
      const journey = await this.model.findById(journeyId).populate('orders').exec();
      if (!journey) {
        throw new Error(`Journey with ID ${journeyId} not found`);
      }

      // Extract and return the orders
      return journey;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get orders for journey with ID ${journeyId}`);
    }
  }

  async getOrCreateJourneyByRider(riderId: string): Promise<Journey> {
    try {
      const user = await this.userModel.findOne({
        id: riderId},
      );
      // Check if there is a pending or ongoing journey for the rider
      const existingJourney = await this.model.findOne({
        rider: user._id,
        status: { $in: ['pending', 'ongoing'] },
      }).populate({
        path: 'orders',
        populate: {
          path: 'customer',
          model: 'Customer' // Assuming the name of the Customer model is 'Customer'
        }
      }).exec();
    
      
  
      if (existingJourney) {
        // If a journey exists, return it
        return existingJourney;
      } else {
        // If no journey exists, create a new one
        const currentDate = new Date();
        const newJourneyData = {
          rider: user._id,
          orders: [],
          startDate: currentDate,
          createdAt: currentDate,
          updatedAt: currentDate,
          status: 'pending',
        };
        const newJourney = await this.create(newJourneyData as Journey);
        return newJourney;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get or create journey for rider');
    }
  }
  
  

}



