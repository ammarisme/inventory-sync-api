import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import { Controller, Get, Param, Query } from "@nestjs/common";
import { count } from "console";

@Controller("dashboard")
export class DashboardController {

  @Get("/dashboard-summary")
  async getInvoices() {
    try {
      //orders summary
      //inventory summary
      //customers

      const total_invoices = await mongo.countDocumentsWithFilter("invoices", {status : 2});
      const total_customers = await mongo.countDocumentsWithFilter("customers", {status : 2});
      const total_skus = await mongo.countStockAttributes("inventory",{} )
  
  
      return {
        total_invoices : total_invoices,
        total_customers : total_customers,
        total_skus : total_skus,

      }
    } catch (error) {
      utils.log(error)
    }
  }


  @Get("/search")
  async searchInvoices(@Query('invoice_number') invoice_number: string) {
    try {
      const desiredColumns = { invoice_number: 1, status: 1, createdAt: 1, source_order_number:1 }; // Only include fields A, B, and C

      const result = await mongo.getDocsByKeyword("invoices", invoice_number);
  
      return result
    } catch (error) {
      utils.log(error)
    }
  }

  @Get("/top-10-cities-by-orders")
  async getTopCustomerCities() {
    try {
  
      // Use aggregation pipeline to group by city and sort by count (descending)
      const aggregation = [
        {
          $group: {
            _id: "$shipping.city", // Group by city
            count: { $sum: 1 }, // Count documents in each group
            totalValue: { $sum: {
              $toDouble: "$total", // Convert 'total' to a double (if string) before summing
            },  }, // Sum of order totals in each group
          },
        },
        {
          $project: {
            _id: "$_id", // City name
            count: "$count", // Total orders
            averageOrderValue: { $avg: { $divide: ["$totalValue", "$count"] } }, // Average order value
          },
        },
        { $sort: { count: -1 } }, // Sort by count in descending order
        { $limit: 10 }, // Limit to top 10 cities
      ];
  
      const results =  await mongo.executeQuery("orders", aggregation, {})
  
      // const cities = results.map(result => result._id);
      // const orderCounts = results.map(result => result.count);
  
      // return { "cities": "orderCounts" :cities, orderCounts }; // Return an object with separate arrays
      return results.map((result) => ({
        city: result._id,
        orderCount: result.count,
        averageOrderValue: result.averageOrderValue.toFixed(2)/10, // Format to 2 decimal places
      }));
    } catch (err) {
      console.error('Error getting top customer cities:', err);
      throw err; // Re-throw for potential error handling
    }
  }
  @Get("/top-10-cities-by-order-value")
  async getTopCitiesByOrderValue() {
    try {
  
      // Use aggregation pipeline to group by city and sort by count (descending)
      const aggregation = [
        {
          $group: {
            _id: "$shipping.city", // Group by city
            count: { $sum: 1 }, // Count documents in each group
            totalValue: { $sum: {
              $toDouble: "$total", // Convert 'total' to a double (if string) before summing
            },  }, // Sum of order totals in each group
          },
        },
        
        { $sort: { totalValue: -1 } }, // Sort by count in descending order
        { $limit: 10 }, // Limit to top 10 cities
      ];
  
      const results =  await mongo.executeQuery("orders", aggregation, {})
  
      // const cities = results.map(result => result._id);
      // const orderCounts = results.map(result => result.count);
  
      // return { "cities": "orderCounts" :cities, orderCounts }; // Return an object with separate arrays
      return results.map((result) => ({
        city: result._id,
        orderCount: result.count,
        totalValue: result.totalValue.toFixed(2)/1, // Format to 2 decimal places
      }));
    } catch (err) {
      console.error('Error getting top customer cities:', err);
      throw err; // Re-throw for potential error handling
    }
  }
  
}