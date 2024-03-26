import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("invoice")
export class InvoiceController {

  @Get("/:client_id")
  async getInvoices(@Param("client_id") client_id: string) {
    try {
      const desiredColumns = { invoice_number: 1, status: 1, createdAt: 1, source_order_number:1 }; // Only include fields A, B, and C

      const result = await mongo.getCollectionColumns("invoices", desiredColumns);
      result.forEach((invoice) => {
        invoice.status = invoice.status === 1 ? "failed" : "success";
      });
  
      return result
    } catch (error) {
      utils.log(error)
    }
  }
}