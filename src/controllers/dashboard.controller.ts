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
}