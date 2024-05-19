import { Model, Types } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Journey, JourneyDto, JourneyModel } from './journey.schema';
import { Order, OrderStatuses } from '../order/order.schema';
import { User } from '../user/user.schema';
import { ObjectId } from 'mongodb';

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

  async resetJourney(journeyId: string): Promise<Object> {
    try {
      let journey = await this.model.findById(journeyId).exec();
      if (!journey) {
        // If journey doesn't exist, create a new one
        throw new Error(`No journey with ID ${journeyId}`);
      }

    
       // Update order statuses to "allocated"
       await Promise.all(journey.orders.map(order_id =>
        this.orderModel.updateOne({ order_id: order_id }, { status: OrderStatuses.invoice_pending }).exec()
      ));

      journey.orders = [];

      await journey.save();
      return journey;
    } catch (error) {
      console.error(error);
      return { "eror": error };
    }
  }
    
  async startJourney(journeyId: string): Promise<Journey> {
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
      const journey = await this.model.findById(journeyId).exec();
      if (!journey) {
        throw new Error(`Journey with ID ${journeyId} not found`);
      }
  
      // Update status of each order to "shipped"
      const orderIds = journey.orders.map(order => order._id);
      if(!orderIds || orderIds.length == 0){
        throw new Error(`Journey with ID ${journeyId} doesn't have orders assigned it it.`);
      }
      
      await this.orderModel.updateMany({ _id: { $in: orderIds } }, { status: "shipped" }).exec();
  
      const journey_updated = await this.model.findById(journeyId).populate({
        path: 'orders',
        populate: {
          path: 'customer',
          model: 'Customer' // Assuming the name of the Customer model is 'Customer'
        }
      }).exec();

      return journey_updated;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async pauseJourney(journeyId: string): Promise<Journey> {
    try {
      const currentDate = new Date();
      
      // Update journey status and timestamps
      await this.model.updateOne({ _id: journeyId }, 
        {
          status: "pending",
          startDate: currentDate,
          createdAt: currentDate,
          updatedAt: currentDate,
        }).exec();
  
      // Retrieve orders associated with the journey
      const journey = await this.model.findById(journeyId).exec();
      if (!journey) {
        throw new Error(`Journey with ID ${journeyId} not found`);
      }
  
      // Update status of each order to "shipped"
      const orderIds = journey.orders.map(order => order._id);
      if(!orderIds || orderIds.length == 0){
        throw new Error(`Journey with ID ${journeyId} doesn't have orders assigned it it.`);
      }
      
      await this.orderModel.updateMany({ _id: { $in: orderIds } }, { status: "shipping_scheduled" }).exec();
  
      const journey_updated = await this.model.findById(journeyId).populate({
        path: 'orders',
        populate: {
          path: 'customer',
          model: 'Customer' // Assuming the name of the Customer model is 'Customer'
        }
      }).exec();

      return journey_updated;
    } catch (error) {
      console.error(error);
      return null;
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
  
  
  async  getJourney(journeyId: string): Promise<JourneyDto> {
    try {
      // Find the journey by ID and populate the "orders" field to get all associated orders
      const journey = await JourneyModel.findById(journeyId)
      .populate({
          path: 'orders',
          populate: {
              path: 'customer', // Populate the customer field in the orders
          },
      })
      .exec() as unknown as JourneyDto;
      if (!journey) {
        throw new Error(`Journey with ID ${journeyId} not found`);
      }

  
      // Initialize variables for calculated amounts
      let pendingCOD = 0;
      let collectedCOD = 0;
      let deliveryChargesCollected = 0;
      let deliveryChargesPending = 0;
      let returnCOD = 0;
  
      // Iterate through orders to calculate COD and delivery charges
      for (const order of journey.orders) {
        // Here, you would calculate the COD and delivery charges based on the order properties
        // For demonstration, let's assume CODAmount and deliveryCharge are properties of the order object
        if (order.selected_payment_method.method == "cod" && order.status === 'delivered') {
          collectedCOD += order.order_total;
        }else if(order.selected_payment_method.method == "cod" ){
          pendingCOD += order.order_total
        }

        if(order.selected_payment_method.method == "cod" && order.status == "ndr"){
          returnCOD += order.return_total;
        }
        
  
        if (order.status == 'delivered' || order.status == "ndr") {
          deliveryChargesCollected += order.shipping_fee;
        } else  {
          deliveryChargesPending += order.shipping_fee;
        }
      }
  
      // Create a new JourneyDto object with the journey details and calculated amounts
      const journeyDto: JourneyDto = {
        _id : journey._id,
        rider: journey.rider,
        orders: journey.orders,
        startDate: journey.startDate, // Convert Date to string
        createdAt: journey.createdAt, // Convert Date to string
        updatedAt: journey.updatedAt, // Convert Date to string
        status: journey.status,
        endDate: journey.endDate ? journey.endDate : '', // Convert Date to string if endDate exists
        packageCount: journey.orders.length,
        cod_returns: returnCOD,
        cod_collected: collectedCOD, // Assuming all COD amounts are collected
        cod_pending: pendingCOD, // Assuming there are no pending COD amounts
        cod_total: (collectedCOD + pendingCOD) - returnCOD,
        shipping_fee_collected: deliveryChargesCollected,
        shipping_fee_pending: deliveryChargesPending,
        shipping_fee_total: deliveryChargesCollected + deliveryChargesPending,
      };
  
      // Return the JourneyDto object
      return journeyDto;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get journey with ID ${journeyId}`);
    }
  }

  

  async getOrCreateJourneyByRider(riderId: string): Promise<Journey> {
    try {
      const user = await this.userModel.findOne({
        id: riderId
      },
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
  

  async getJourneyByRiderEmail(email: string): Promise<JourneyDto[]> {
    try {
      const user = await this.userModel.findOne({ email: email });
      // Check if there is a pending or ongoing journey for the rider
      const journeys = await this.model.find({
        rider: user._id,
      }).populate({
        path: 'orders',
        populate: {
          path: 'customer',
          model: 'Customer' // Assuming the name of the Customer model is 'Customer'
        }
      }).exec();
  
      // Format dates and times to human-readable format
      const formattedJourneys = journeys.map(journey => ({
        ...journey.toObject(),
        endDate: journey.endDate?journey.endDate.toLocaleString() :"", // Adjust as needed
        startDate:  journey.startDate?journey.startDate.toLocaleString() :"", // Adjust as needed
        createdAt: journey.createdAt.toLocaleString(), // Adjust as needed
        updatedAt: journey.updatedAt.toLocaleString(), // Adjust as needed
        // Assuming there are more date/time fields in the journey object
      } as JourneyDto));
  
      // If a journey exists, return it
      return formattedJourneys;
  
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get journeys for rider');
    }
  }
  
  

}



