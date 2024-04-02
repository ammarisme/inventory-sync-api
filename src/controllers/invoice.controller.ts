import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("invoice")
export class InvoiceController {

  @Get("/get/:client_id")
  async getInvoices(@Param("client_id") client_id: string) {
    try {
      const desiredColumns = { invoice_number: 1, status: 1, createdAt: 1, source_order_number:1 }; // Only include fields A, B, and C

      const result = await mongo.getCollectionColumns("invoices", desiredColumns);
      result.map((invoice) => {
        invoice.status = invoice.status === 1 ? "failed" : "success";
      });
  
      return result
    } catch (error) {
      utils.log(error)
    }
  }
  @Get("/reschedule-all-pending")
  async rescheduleAll(@Param("client_id") client_id: string) {
    try {
      const result = await mongo.updateCollectionStatus("invoices",{status: 1}, { status: 4 } );
      
      return result
    } catch (error) {
      utils.log(error)
    }
  }

 

  @Get("pending")
  async getInvoicesByStatus() {
    try {
      const desiredColumns = { invoice_number: 1, status: 1, createdAt: 1, source_order_number:1 }; // Only include fields A, B, and C

      let result = await mongo.getCollectionColumns("invoices", desiredColumns);
      let myresult = []
      result.map((invoice) => {
        if(invoice.status == 1){
          invoice.status = "failed"
          myresult.push(invoice)
        }
      });
  
      return myresult
    } catch (error) {
      utils.log(error)
    }
  }

  @Get("scheduled")
  async getScheduled() {
    try {
      const desiredColumns = { invoice_number: 1, status: 1, createdAt: 1, source_order_number:1 }; // Only include fields A, B, and C

      let result = await mongo.getCollectionColumns("invoices", desiredColumns);
      let myresult = []
      result.map((invoice) => {
        if(invoice.status == 4){
          invoice.status = "scheduled"
          myresult.push(invoice)
        }
      });
  
      return myresult
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