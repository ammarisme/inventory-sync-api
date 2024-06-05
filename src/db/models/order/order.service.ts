import { Model, UpdateQuery } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order, CreateOrderDto, AddTrackingStatus, LineItem, OrderStatuses, OrderWithCustomFields, ParseOrderDto, Cost, Revenue, RevenueStatus, CostStatus, TrackingDataDto } from './order.schema';
import { CreateCustomerDto, Customer, CustomerModel } from '../customer/customer.schema';
import { City } from '../cities/cities.schema';
import { State } from '../state/state.schema';
import { RevenueSchema } from '../revenue/revenue.schema';
import { ProductMapping } from '../product_mapping/product-mapping.schema';
const axios = require('axios');

@Injectable()
export class OrderService {

  constructor(
    @Inject('ORDER_MODEL')
    private model: Model<Order>,
    @Inject('CUSTOMER_MODEL')
    private customermodel: Model<Customer>,
    @Inject('CITY_MODEL')
    private cityModel: Model<City>,
    @Inject('STATE_MODEL')
    private stateModel: Model<State>,
    @Inject('PRODUCT_MAPPING_MODEL')
    private productMappingModel: Model<ProductMapping>,
  ) { }

  async create(createOrdeDto: CreateOrderDto): Promise<Order> {
    // Set the createdAt field of the order
    createOrdeDto.createdAt = new Date();
    createOrdeDto.revenues = []
    createOrdeDto.costs = []

    if (["cod", "cheque", "daraz"].includes((createOrdeDto.selected_payment_method as { method: string }).method)) {
      createOrdeDto.revenue_status = RevenueStatus.pending;
    } else {
      createOrdeDto.revenue_status = RevenueStatus.paid;
    }

    createOrdeDto.cost_status = CostStatus.pending;


    // Create the customer DTO
    const newCustDto: CreateCustomerDto = {
      customer_id: createOrdeDto.customer.phone,
      first_name: createOrdeDto.customer.first_name,
      last_name: createOrdeDto.customer.last_name,
      phone: createOrdeDto.customer.phone,
      email: createOrdeDto.customer.email,
      address1: createOrdeDto.customer.address1,
      address2: createOrdeDto.customer.address2,
      state: createOrdeDto.customer.state,
      city: createOrdeDto.customer.city,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: createOrdeDto.source
    };

    if (newCustDto.city) {

      const existing_city = await this.cityModel.findOne({ id: newCustDto.city })
      if (!existing_city) {
        const newCity = new this.cityModel({
          id: newCustDto.city,
          name: newCustDto.city,
          country: "sri lanka"
        })
        await newCity.save();
      }

    }

    if (newCustDto.state) {

      const existing_state = await this.stateModel.findOne({ id: newCustDto.state })
      if (!existing_state) {
        const newState = new this.stateModel({
          id: newCustDto.state,
          name: newCustDto.state,
          country: "sri lanka"
        })
        await newState.save();
      }

    }


    // Create the customer using the customer service
    const createdCustomer = await this.customermodel.create(newCustDto);


    createOrdeDto.revenues = this.getAllRevenues(createOrdeDto);
    createOrdeDto.costs = this.getAllCosts(createOrdeDto);
    createOrdeDto.invoice_generation_success_count =  0;


    // Create the order using the provided DTO
    const createdCat = new this.model({
      ...createOrdeDto,
      createdAt: new Date(),
      updatedat: new Date(),
      customer: createdCustomer._id // Link customer to order
    });
    await createdCat.save();

    // Return the created order
    return createdCat;
  }



  async findAll(): Promise<Order[]> {
    return this.model.find().exec();
  }

  async findOrdersByStatus(status: String): Promise<Order[]> {
    return this.model.find({ status: status }).populate('customer').exec();
  }

  async findUninvoicedOrders(): Promise<Order[]> {
    return this.model.find({
        status: { $in: ['invoice_pending', 'order_confirmed', "shipping_scheduled"] },
        invoice_generation_success_count: 0
    }).populate('customer').exec();
}


  async updateOrdersStatus(status: string, orderIds: string[]): Promise<Object> {
    try {
      // Update order statuses to "allocated"
      await Promise.all(orderIds.map(order_id =>
        this.model.updateOne({ order_id: order_id }, { status: status }).exec()
      ));

    } catch (error) {
      console.error(error);
      return { "error": error };
    }
  }

  async shipOrders(courier: string, orderIds: string[]): Promise<Object> {
    try {
      // Update order statuses to "allocated"
      await Promise.all(orderIds.map(order_id =>
        this.model.updateOne({ order_id: order_id }, { courier_id: courier, status: "shipped" }).exec()
      ));

      await Promise.all(orderIds.map((order_id) => {
        if(order_id.length < 6){
          //this.updateOrderStatus(order_id, "shipped")
        }
      }
      ));

    } catch (error) {
      console.error(error);
      return { "error": error };
    }
  }

  async updateReturns(order_id: string, status: string, status_remark: string, return_items: any[]): Promise<Object> {
    try {
      // Calculate the total return amount
      let return_total = return_items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);

      // Update the order document with the provided order_id
      let result = await this.model.updateOne(
        { order_id: order_id },
        { $set: { return_items: return_items, return_total: return_total, status: "ndr" } }
      ).exec();

    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }


  async findByStatusWithCustomFields(status: String): Promise<OrderWithCustomFields[]> {
    const orders = await this.model.find({ status: status }).populate("customer").exec();
    const ordersWithCustomFields = await Promise.all(orders.map(async (order) => {
      return this.getDetailedOrder(order)
    }));
    return ordersWithCustomFields;
  }


  getDetailedOrder(order){
    const lastStatusChange = order.status_history[order.status_history.length - 1]; // Assuming status_history is sorted by updatedAt
    let updatedAt = lastStatusChange ? new Date(lastStatusChange.updatedAt) : new Date(); // If updatedAt is undefined, assign current time
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime.getTime() - updatedAt.getTime()); // Difference in milliseconds
    const hoursDifference = (isNaN(Math.floor(timeDifference / (1000 * 60 * 60))) ? 0 : Math.floor(timeDifference / (1000 * 60 * 60))) + " hr(s)"; // Convert milliseconds to hours
    const formattedOrderTotal = order.order_total ? order.order_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";

    // Calculate order_age if createdAt is defined
    const created_date_time = order.createdAt ?  new Date(order.createdAt).toLocaleString("af-ZA", { timeZone: 'Asia/Colombo' }) : null;
    const orderAge = order.createdAt ? Math.floor((currentTime.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : null; // Difference in days
    const orderAgedays = orderAge > 0 ? orderAge.toString() + " day(s)" : "-"
    
    
      // Calculate total revenue
      const totalRevenueNum = order.revenues.reduce((acc, revenue) => acc + convertToNumber(revenue.amount), 0);

      // Calculate total costs
      const totalCostsNum = order.costs.reduce((acc, cost) => acc + convertToNumber(cost.amount), 0);

      // Convert the amount to a number if it's a string
      function convertToNumber(amount: number | string): number {
        return typeof amount === 'string' ? parseFloat(amount) : amount;
      }
      // Calculate profit
      const profit = (totalRevenueNum - totalCostsNum);
      // Calculate profit percentage (rounded to two decimals) and add % sign
      const profitPercentage = Math.round((profit / totalCostsNum) * 100);

      // Construct and return the OrderWithCustomFields object
      return {
        ...order.toObject(),
        time_in_status: hoursDifference,
        order_total_display: formattedOrderTotal,
        order_age: orderAgedays,
        total_revenue: totalRevenueNum.toLocaleString(),
        total_costs: totalCostsNum.toLocaleString(),
        profit: profit.toLocaleString(),
        profit_percentage: profitPercentage.toLocaleString() + '%',
        created_date_time : created_date_time,
      } as OrderWithCustomFields;
  }


  async findByTrackingNumberWithCustomFields(tracking_number: string): Promise<OrderWithCustomFields | null> {
    try {
      // Find the order by its order_id
      const order = await this.model.findOne({ tracking_number: tracking_number }).populate("customer").exec();

      if (!order) {
        // If the order is not found, return null
        return null;
      }

      // Extract necessary information from the order
      return this.getDetailedOrder(order);
    } catch (error) {
      // Handle any errors
      console.error("Error retrieving order by order_id:", error);
      return null;
    }
  }

  async findByOrderIdWithCustomFields(orderId: string): Promise<OrderWithCustomFields | null> {
    try {
      // Find the order by its order_id
      const order = await this.model.findOne({ order_id: orderId }).populate("customer").exec();

      if (!order) {
        // If the order is not found, return null
        return null;
      }
    return this.getDetailedOrder(order);
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
    this.model.updateOne({ order_id: orderId }, { status: status }).exec();
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
    if(status=="invoice_generated"){
      await this.model.updateOne(
        { order_id: orderId },
        {
          $set: { status: status },
          $push: { status_history: statusHistoryObj }
        }
      ).exec();
    }else{
      const order = await this.model.findOne({order_id : orderId});
      const invoice_generation_success_count = (order.invoice_generation_success_count??0) + 1
      await this.model.updateOne(
        { order_id: orderId },
        {
          $set: { status: status, invoice_generation_success_count : invoice_generation_success_count },
          $push: { status_history: statusHistoryObj }
        }
      ).exec();
    }

    if(status == "delivered" || status == "shipped" || status == "invoice_generated"){
      if(orderId.length < 6){
        //this.updateOrderStatus(orderId, status);
      }
    }
   

    return true;
  }

  async updateRevenueStatusByIdWithRemark(orderId: String, status: String, status_remark: String): Promise<boolean> {
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
        $set: { revenue_status: status },
        $push: { revenue_history: statusHistoryObj }
      }
    ).exec();

    return true;
  }

  async updateTracking(order_id: String, courier_id: String, tracking_number: String): Promise<boolean> {
    this.model.updateOne({ order_id: order_id }, { courier_id: courier_id, tracking_number: tracking_number }).exec();
    return true;
  }

  async updateTrackingData(order_id: any, mystatus: String, revenue_status: String, tracking_data: TrackingDataDto[]) {
    this.model.updateOne({ order_id: order_id }, { tracking_data: tracking_data, revenue_status: revenue_status, status: mystatus }).exec();
  }

  async updateOrderNote(order_id: String, order_note: String): Promise<boolean> {
    this.model.updateOne({ order_id: order_id }, { order_note: order_note }).exec();
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

  async upsertOrderByOrderId(orderId: string, createOrderDto: ParseOrderDto): Promise<boolean> {
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


  async parseDarazCsvData(data: string): Promise<CreateOrderDto[]> {
    const lines = data.split('\n'); // Split data into lines

    // Extract header row (assuming the first line is the header)
    const headers = lines[0].split(';');

    // Create an empty result array to store parsed data
    const parsedData: CreateOrderDto[] = [];

    // Define the status history object
    const statusHistoryObj = {
      status: OrderStatuses.order_confirmed,
      status_remark: "",
      updatedAt: new Date() // Set the updatedAt time
    } as never;

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
      const mapped_product = await this.productMappingModel.findOne({ source_sku: lineItem["Seller SKU"] })
      if (orderIndex !== -1) {
        //if the sku has a mapping, add that sku instead.
        const lineItemObj = new LineItem(
          mapped_product != null ? mapped_product.product_name : lineItem["Item Name"],
          mapped_product != null ? mapped_product.sku : lineItem["Seller SKU"],
          mapped_product != null ? mapped_product.quantity : 1,
          "piece(s)",
          parseFloat(lineItem['Unit Price']), // Parse unit price to float
          0.0, // Parse item tax to float
          0.0 // Parse item discount to float
        );
        parsedData[orderIndex].line_items.push(lineItemObj);
        parsedData[orderIndex].order_total = parsedData[orderIndex].line_items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
        // Recalculate order total
      } else {
        // If order doesn't exist, create a new order object
        const order = new CreateOrderDto();
        order.order_id = lineItem['Order Number'];
        order.source = "daraz"
        order.courier_id = "lk-dex";
        order.invoice_number = "DRZ" + lineItem['Order Number'];
        order.customer =
          {
            // Set customer information here
            customer_id: lineItem["Customer Email"],
            first_name: lineItem["Customer Name"], // Assuming customer name is provided in CSV
            last_name: "",
            address1: lineItem["Billing Address"],
            address2: "",
            city: lineItem["Billing Address5"],
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: lineItem["Billing Phone Number"],
            email: lineItem["Customer Email"],
            state: lineItem["Billing Address3"],
            // Add other customer details if available
          } as Customer;
        order.selected_payment_method = { method: "daraz" }; // Set payment method
        order.tracking_number = lineItem['Tracking Code']; // Use order number as tracking number


        const lineItemObj = new LineItem(
          mapped_product != null ? mapped_product.product_name : lineItem["Item Name"],
          mapped_product != null ? mapped_product.sku : lineItem["Seller SKU"],
          mapped_product != null ? mapped_product.quantity : 1,
          "piece(s)",
          parseFloat(lineItem['Unit Price']), // Parse unit price to float
          0.0, // Parse item tax to float
          0.0 // Parse item discount to float
        );

        // Set other order properties accordingly
        order.line_items = [
          lineItemObj
        ];
        // Calculate order total
        order.order_total = order.line_items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
        order.status = OrderStatuses.order_confirmed;
        order.status_history = [];
        order.status_history.push(statusHistoryObj)
        parsedData.push(order);
      }
    }

    return parsedData;
  }

  async search(
    customerCity: string | null,
    customerState: string | null,
    courierId: string | null,
    source: string | null,
    order_status: string | null,
    searchText: string
  ): Promise<Order[]> {
    const query: any = {};

    if (source) {
      query['source'] = source;
    }

    if (order_status) {
      query['status'] = order_status;
    }

    if (courierId) {
      query['courier_id'] = courierId;
    }

    if (searchText && searchText.trim() !== '') {
      query['invoice_number'] = { $regex: searchText, $options: 'i' };
    }

    if (searchText && searchText.trim() !== '') {
      // Include searchText in the query for invoice_number, courier_id, or source
      query.$and = [
        { 'invoice_number': { $regex: searchText, $options: 'i' } },
      ];
    }

    // Execute the MongoDB query and populate the 'customer' field
    const orders = await this.model.find(query).populate('customer').exec();

    // Filter orders based on customer city and state
    const filteredOrders = orders.filter((order) => {
      const customer = order.customer as unknown as Customer;
      if (customerCity && customer.city !== customerCity) {
        return false;
      }
      if (customerState && customer.state !== customerState) {
        return false;
      }
      return true;
    });

    return filteredOrders;
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


  //Revenue functions

  async countOrdersByRevenueStatus(): Promise<{ status: string, count: number }[]> {
    return this.model.aggregate([
      {
        $group: {
          _id: "$revenue_status",
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


  async findByRevenueStatusWithCustomFields(status: RevenueStatus): Promise<OrderWithCustomFields[]> {
    const orders = await this.model.find({ revenue_status: status }).populate("customer").exec();
    const ordersWithCustomFields = await Promise.all(orders.map(async (order) => {
      return this.getDetailedOrder(order)
    }));
    return ordersWithCustomFields;
  }


  async findOrdersByRevenueStatus(status: RevenueStatus): Promise<Order[]> {
    return this.model.find({ revenue_status: status }).populate('customer').exec();
  }

  async updateRevenueStatusById(orderId: String, status: RevenueStatus): Promise<boolean> {
    this.model.updateOne({ order_id: orderId }, { revenue_status: status }).exec();
    return true;
  }

  async updateOrderRevenueStatus(status: RevenueStatus, orderIds: string[]): Promise<Object> {
    try {
      // Update order statuses to "allocated"
      await Promise.all(orderIds.map(order_id =>
        this.model.updateOne({ order_id: order_id }, { revenue_status: status }).exec()
      ));

    } catch (error) {
      console.error(error);
      return { "error": error };
    }
  }


  getAllRevenues(createOrdeDto: CreateOrderDto): Revenue[] {
    let revenues = []

    // add all revenues
    const order_sum = new Revenue()
    order_sum.amount = createOrdeDto.order_total as number;
    order_sum.type = "order_sum"
    order_sum.description = "Order Sum"
    order_sum.status = "not-received"
    revenues.push(order_sum)

    const shipping_charges = new Revenue()
    shipping_charges.amount = createOrdeDto.shipping_fee as number;
    shipping_charges.type = "shippnng_fee"
    shipping_charges.description = "Shipping Charges"
    shipping_charges.status = "not-received"
    revenues.push(shipping_charges)

    return revenues;
  }


  getAllCosts(createOrdeDto: CreateOrderDto): Cost[] {
    let costs = []


    //add costs and revenue lines to the object.
    switch (createOrdeDto.selected_payment_method["method"]) {
      case "cod":
        const cod_cost = new Cost()
        cod_cost.type = "cod_fee"
        cod_cost.amount = 0;
        cod_cost.status = "not-settled";
        cod_cost.description = "COD Collection fee";
        costs.push(cod_cost)
        break;
      case "bacs":
        break;
      case "webxpay":
        const cost_webxpay = new Cost()
        cost_webxpay.type = "webxpay_fee"
        cost_webxpay.amount = createOrdeDto.order_total as number * 0.018;
        cost_webxpay.status = "not-settled";
        cost_webxpay.description = "Card processing fee";
        costs.push(cost_webxpay);
        break;
    }

    //paid shipping fee
    const paid_shipping_fee = new Cost()
    paid_shipping_fee.amount = createOrdeDto.shipping_fee as number;
    paid_shipping_fee.type = "shipping_fee"
    paid_shipping_fee.status = "not-settled"
    paid_shipping_fee.description = "Shipping fee"
    costs.push(paid_shipping_fee)

    //add all costs
    const cost_goods = new Cost()
    cost_goods.amount = 0;//to be added later.
    cost_goods.type = "goods"
    cost_goods.status = "settled"
    cost_goods.description = "Goods purchase"
    costs.push(cost_goods)

    const packaging = new Cost()
    packaging.amount = 0;//to be added later.
    packaging.type = "packaging-materials"
    packaging.status = "settled"
    packaging.description = "Packaging Materials"
    costs.push(packaging)

    const warehousing = new Cost()
    warehousing.amount = 0;//to be added later.
    warehousing.type = "warehousing"
    warehousing.status = "settled"
    warehousing.description = "Warehousing"
    costs.push(warehousing)

    return costs;
  }

  
  async updateOrderStatus(order_id, status) {
    // Call the PUT API to update the stock quantity
    const apiUrl = `https://catlitter.lk/wp-json/wc/v3/orders/${order_id}`;
    const data = {
      status: status
    }
  
    try {
      const putReponse = await axios.post(apiUrl, data, {
        headers: {
          Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',  // Replace 'asd' with your actual authorization code
          'Content-Type': 'application/json'
        }
      });

      return putReponse;
  
    } catch (error) {
      console.error(`Failed to create note: ${order_id}`, error);
    }
  }


  // async syncwoocommerce() {
  //   try {

  //     const processing_orders = await this.getOrdersByStatus("processing", 1)
  //     if (processing_orders.length == 0) {
  //       console.log("no orders to process")
  //     } else {
  //       //create new orders
  //       for (const order of processing_orders) {
  //         let total = 0;
  //         order.line_items.forEach((item) => {
  //           total += item.quantity * item.price;
  //         });
  //         let line_items = order.line_items.map((item) => {
  //           return {
  //             product_name: item.name,
  //             sku: item.sku,
  //             quantity: item.quantity,
  //             unit_price: item.price
  //           };
  //         });

  //         const lastCustomField = order.meta_data.reverse().find(o => o.key === "custom_field");

          
  //         // const prefix = order_source.prefix;
  //         // Create order object
  //         const createOrderDto = new CreateOrderDto();
  //         createOrderDto.source =  lastCustomField ? lastCustomField.value : "website",
  //         createOrderDto.order_id= order.number
  //         // createOrderDto.invoice_number= prefix + order.number
  //         createOrderDto.status= OrderStatuses.order_confirmed
  //         createOrderDto.status_history= [{ status: OrderStatuses.order_confirmed, status_remark: "", updatedAt: new Date()}]
  //         createOrderDto.line_items= line_items,
  //         createOrderDto.order_total= total,
  //         createOrderDto.shipping_fee= order.shipping_total,
  //         createOrderDto.selected_payment_method= { method: order.payment_method },

  //         createOrderDto.customer =new  CustomerModel();
  //         createOrderDto.customer.first_name= order.shipping.first_name != '' ? order.shipping.first_name ?? '' : order.billing.first_name ?? '',
  //         createOrderDto.customer.last_name= order.shipping.last_name != '' ? order.shipping.last_name ?? '' : order.billing.last_name ?? '',
  //         createOrderDto.customer.phone= order.shipping.phone != '' ? order.shipping.phone ?? '' : order.billing.phone ?? '',
  //         createOrderDto.customer.email= order.shipping.email != '' ? order.shipping.email ?? '' : order.billing.email ?? '',
  //         createOrderDto.customer.address1= order.shipping.address_1 ?? '',
  //         createOrderDto.customer.address2= order.shipping.address_2 ?? '',
  //         createOrderDto.customer.state= order.shipping.state ?? '',
  //         createOrderDto.customer.city= order.shipping.city ?? ''
  //         this.create(createOrderDto);
  //       }
  //     }
  //     const invoice_generate_orders = await this.getOrdersByStatus("invoice-generate", 1)
  //     if (invoice_generate_orders.length == 0) {
  //       console.log("no orders to process")
  //     } else {
  //       //update order statuses
  //       for (const order of invoice_generate_orders) {
  //         //update order using api
  //         this.updateOrdersStatus(OrderStatuses.order_confirmed, [order.order_id])
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  // async getOrdersByStatus(status, i) {
  //   while (true) {
  //     try {
  //       const url = `https://catlitter.lk/wp-json/wc/v3/orders?status=${status}&page=${i}&per_page=100`;
  //       console.log(url)
  //       const headers = {
  //         Authorization: 'Basic Y2tfYjdlNTVlMTdjY2U4ZDEzYjA1MGM4MmU3Yjg1ZmRlZjg5MzVhM2FjNzpjc185NGZjZDg0MTliZTgzZmUzYWZjMGNlZTJmOGRjNjEwZWUwYTUzNWYy',
  //       };

  //       const response = await axios.get(url, { headers });
  //       return response.data;
  //     } catch (error) {
  //       throw new Error(`Failed to call API: ${error.message}`);
  //     }
  //   }
  // }

}