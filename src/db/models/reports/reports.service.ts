import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journey, JourneyDto } from 'src/db/models/journey/journey.schema';
import { Order } from 'src/db/models/order/order.schema';
import { User } from 'src/db/models/user/user.schema';
import { RiderReport } from './reports.dto';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';


@Injectable()
export class ReportService {
  constructor(
    @Inject('JOURNEY_MODEL')
    private journeyModel: Model<Journey>,
    @Inject('ORDER_MODEL') // Inject the Order model
    private ordersl: Model<Order>,
    @Inject('USER_MODEL') // Inject the Order model
    private userModel: Model<User>,
  ) {}

  async riderReport(rider: string, start_date: string, end_date: string): Promise<RiderReport | null> {
    try {
      // Find the rider (user)
       // Parse the start and end dates from 'dd-MM-yyyy' format to Date objects
       const parsedStartDate = new Date(start_date)
       const parsedEndDate =  new Date(end_date)
 
       // Find the rider (user)
       const riderObj = await this.userModel.findOne({id : rider});
       if (!riderObj || !riderObj.is_rider) {
         throw new Error('Rider not found or not a rider');
       }
 
       // Fetch journeys for the given rider and date range
       const journeys = await this.journeyModel.find({
         rider: riderObj._id,
         startDate: { $gte: parsedStartDate },
         endDate: { $lte: parsedEndDate }
       }).populate('orders').exec();

       const reportData = journeys.map(journey => {
        const deliveredOrders = journey.orders.filter(order => (order as unknown as Order).status === 'delivered');
        const deliveryCharges = deliveredOrders.reduce((sum, order) => sum + (order as unknown as Order).shipping_fee, 0);
        const orderTotals = deliveredOrders.reduce((sum, order) => sum + (order as unknown as Order).order_total, 0);
        const orderCount = deliveredOrders.length;
  
        return {
          rider_name: `${riderObj.first_name} ${riderObj.last_name}`,
          delivery_charges: deliveryCharges,
          order_totals: orderTotals,
          order_count: orderCount,
          journey_end_date: journey.endDate,
          journeyId: journey._id
        };
      });
      const report = new RiderReport();
      report.data = reportData;

      return report;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}
