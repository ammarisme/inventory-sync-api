import { Model, UpdateQuery } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order, CreateOrderDto, AddTrackingStatus, LineItem, OrderStatuses, OrderWithCustomFields } from './order.schema';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MODEL')
    private model: Model<Order>,
  ) { }

  async create(createCatDto: CreateOrderDto): Promise<Order> {
    createCatDto.createdAt = new Date();
    const createdCat = new this.model(createCatDto);
    return createdCat.save();
  }
  

  async findAll(): Promise<Order[]> {
    return this.model.find().exec();
  }

  async findOrdersByStatus(status: String): Promise<Order[]> {
    return this.model.find({ status: status }).exec();
  }


  async findByStatusWithCustomFields(status: String): Promise<OrderWithCustomFields[]> {
    const orders = await this.model.find({ status: status }).exec();
    const ordersWithCustomFields = await Promise.all(orders.map(async (order) => {
        const lastStatusChange = order.status_history[order.status_history.length - 1]; // Assuming status_history is sorted by updatedAt
        let updatedAt = lastStatusChange ? new Date(lastStatusChange.updatedAt) : new Date(); // If updatedAt is undefined, assign current time
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime.getTime() - updatedAt.getTime()); // Difference in milliseconds
        const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
        const formattedOrderTotal = order.order_total ? order.order_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
        
        // Calculate order_age if createdAt is defined
        const createdAt = order.createdAt ? new Date(order.createdAt) : null;
        const orderAge = createdAt ? Math.ceil((currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : null; // Difference in days

        return { ...order.toObject(), time_in_status: hoursDifference, order_total_display: formattedOrderTotal,order_age: orderAge } as OrderWithCustomFields; // Cast to OrderWithCustomFields
    }));
    return ordersWithCustomFields;
}

async findByOrderIdWithCustomFields(orderId: string): Promise<OrderWithCustomFields | null> {
  try {
      // Find the order by its order_id
      const order = await this.model.findOne({ order_id: orderId }).exec();

      if (!order) {
          // If the order is not found, return null
          return null;
      }

      // Extract necessary information from the order
      const lastStatusChange = order.status_history[order.status_history.length - 1];
      const updatedAt = lastStatusChange ? new Date(lastStatusChange.updatedAt) : new Date();
      const currentTime = new Date();
      const timeDifference = Math.abs(currentTime.getTime() - updatedAt.getTime());
      let hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60))??0;
      hoursDifference = hoursDifference != null ? hoursDifference : 0;
      const formattedOrderTotal = order.order_total ? order.order_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
      const createdAt = order.createdAt ? new Date(order.createdAt) : 0;
      const orderAge = createdAt ? Math.ceil((currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;

      // Construct and return the OrderWithCustomFields object
      return {
          ...order.toObject(),
          time_in_status: hoursDifference,
          order_total_display: formattedOrderTotal,
          order_age: orderAge
      } as OrderWithCustomFields;
  } catch (error) {
      // Handle any errors
      console.error("Error retrieving order by order_id:", error);
      return null;
  }
}
  async findById(id: String): Promise<Order | null> {
    return this.model.findById(id).exec();
  }

  async findByOrderId(orderId: String): Promise<Order | null> {
    return this.model.findOne({ order_id: orderId }).exec();
  }

  async updateOrderById(orderId: String, status: String): Promise<boolean> {
    this.model.updateOne({ order_id: orderId }, { status: status}).exec();
    return true;
  }

  async updateOrderByIdWithRemark(orderId: String, status: String, status_remark: String): Promise<boolean> {
    // Define the status history object
    const statusHistoryObj = {
      status: status,
      status_remark: status_remark,
      updatedAt: new Date() // Set the updatedAt time
    };
  
    // Update the order document
    await this.model.updateOne(
      { order_id: orderId }, 
      { 
        $set: { status: status },
        $push: { status_history: statusHistoryObj }
      }
    ).exec();
  
    return true;
  }

  async updateTracking(order_id: String, courier_id: String, tracking_number: String): Promise<boolean> {
    this.model.updateOne({ order_id: order_id }, { courier_id: courier_id, tracking_number: tracking_number }).exec();
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

  async upsertOrderByOrderId(orderId: string, createOrderDto: CreateOrderDto): Promise<boolean> {
    try {
      const update: UpdateQuery<Order> = {
        $set: createOrderDto // Set the entire document with the provided CreateOrderDto
      };
      const options = {
        upsert: true // Create a new document if it doesn't exist
      };

      // Perform the upsert operation
      await this.model.updateOne({ order_id: orderId }, update, options).exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }


  parseDarazCsvData(data: string): CreateOrderDto[] {
    const lines = data.split('\n'); // Split data into lines

    // Extract header row (assuming the first line is the header)
    const headers = lines[0].split(';');

    // Create an empty result array to store parsed data
    const parsedData: CreateOrderDto[] = [];

    // Loop through remaining lines (data lines)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(';');

      // Create an object for the current line item
      const lineItem = Object.fromEntries(
        headers.map((header, index) => [header, values[index] || '']) // Handle missing values
      );

      // Find the index of the order with the matching Daraz Id
      const orderIndex = parsedData.findIndex(order => order.order_id === lineItem['Order Number']);

      // If order exists, add line item to its line_items array
      if (orderIndex !== -1) {
        const order = parsedData[orderIndex];
        const lineItemObj = new LineItem(
          lineItem["Item Name"],
          lineItem["Seller SKU"],
          1, // Parse quantity to integer
          "piece(s)",
          parseFloat(lineItem['Unit Price']), // Parse unit price to float
          0.0, // Parse item tax to float
          0.0 // Parse item discount to float
        );
        order.line_items.push(lineItemObj);
        // Recalculate order total
      } else {
        // If order doesn't exist, create a new order object
        const order = new CreateOrderDto();
        order.order_id = lineItem['Order Number'];
        order.invoice_number = "DRZ" + lineItem['Order Number'];
        order.customer = {
          // Set customer information here
          id: lineItem["Customer Email"],
          first_name: lineItem["Customer Name"], // Assuming customer name is provided in CSV
          last_name : "",
          address1: lineItem["Billing Address"],
          address2: "",
          phone: lineItem["Billing Phone Number"],
          email: lineItem["Customer Email"],
          state: lineItem["Billing Address3"],
          // Add other customer details if available

        };
        order.selected_payment_method = {method:  lineItem["Payment Method"]}; // Set payment method
        order.courier_id = "daraz"; // Set courier
        order.tracking_number = lineItem['Order Number']; // Use order number as tracking number
        // Set other order properties accordingly
        order.line_items = [
          new LineItem(
            lineItem["Item Name"],
            lineItem["Seller SKU"],
            1, // Parse quantity to integer
            "piece(s)",
            parseFloat(lineItem['Unit Price']), // Parse unit price to float
            0.0, // Parse item tax to float
            0.0 // Parse item discount to float
          )
        ];
        // Calculate order total
        order.order_total = order.line_items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
        order.status = OrderStatuses.order_confirmed;
        parsedData.push(order);
      }
    }

    return parsedData;
  }

  
  async countOrdersByStatus(): Promise<{ status: string, count: number }[]> {
    return this.model.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                status: "$_id",
                count: 1,
                _id: 0
            }
        }
    ]).exec();
}

}