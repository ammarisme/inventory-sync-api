import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import woocommerce = require("../services/woocommerce.service");
import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import files =   require("../services/files.service")

@Controller("inventory")
export class InventoryController {

  @Get("/get/:client_id")
  async getInventory(@Param("client_id") client_id: string) {
    try {
      const inventory = await mongo.getFirstDocument("inventory", {
        client_id: client_id
      });
      let result = []
      for(let key in inventory["stock"]){
        result.push(inventory["stock"][key])
      }
      return result
    } catch (error) {
      utils.log(error)
    }
  }

  @Get("/pending-transfer/:client_id")
  async getTransfer(@Param("client_id") client_id: string) {
    try {
      const result =await this.getTransfers()
      return result
    } catch (error) {
      utils.log(error)
    }
  }

  
  async  getTransfers() {
    const inventory = await mongo.getFirstDocument("inventory", {
        client_id: "catlitter"
      });
      let available_stock = inventory["stock"]
    
    const woo_orders = await woocommerce.getOrdersByStatus("invoice-pending")

    let transfers = []
    let total_order_qtys = {}
    
    for (const order of woo_orders) {
      try {
        for (const key in order.line_items) {
          const line_item = order.line_items[key]
          total_order_qtys[line_item.sku] = total_order_qtys[line_item.sku] ? total_order_qtys[line_item.sku] + line_item.quantity : line_item.quantity
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    for (let key in total_order_qtys) {
      const available_product = available_stock[`"${key}"`]

      if (available_product && total_order_qtys[key] > Number(available_product["Catlitter"])) {
        transfers.push({
          sku: key,
          product_name: available_product["Product Name"],
          order_qty: total_order_qtys[key],
          available_qty: Number(available_product["Catlitter"]),
          required: total_order_qtys[key] - Number(available_product["Catlitter"])
        })
      }
    }
    return transfers;
  }

  @Get('/download-pending-transfers/')
  async downloadTransferSheet(@Res() res) {
    const transfers = await this.getTransfers(); // Fetch data for CSV
    files.convertToCSV(transfers)
    return res.sendFile(`transfer_sheet.csv`, { root: './' });
  }

}