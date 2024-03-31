import { Controller, Get, Res, Query, Param, Post, Body, Put } from '@nestjs/common';
import { AppService } from './app.service';
import mongo = require("./services/mongo.service");
import utils = require("./common/util");
const fs = require('fs');


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("order-runs-paginated")
  getOrderRuns(@Query('per_page') per_page: Number, @Query('page') page: Number): string {
    return this.appService.getOrderRunsPaginated(Number(page),Number(per_page));
  }

  @Get("inventory-sync-runs-paginated")
  getInventorySyncRuns(@Query('per_page') per_page: Number, @Query('page') page: Number): string {
    return this.appService.getInventorySyncRunsPaginated(Number(page),Number(per_page));
  }


  @Get('run-transfers')
  async getRunTransfers(@Query('run_id') runId: string, @Res() res) {
    const transfers = await this.appService.getRunTransfers(runId); // Fetch data for CSV
    console.log(transfers[0]["transfers"]["transfers"])
    convertToCSV(runId, transfers[0]["transfers"]["transfers"])
    return res.sendFile(`${runId}.csv`, { root: './' });
  }
  
  @Get("orders-of-run")
  getOrdersOfRun(@Query('run_id') runId: string) {
    return this.appService.getOrdersOfRun(runId);
  }

  @Get("stock-sync-runs")
  getStockSyncRuns() {
    return this.appService.getStockSyncRuns();
  }

  @Get("generate-invoice")
  generateInvoice(@Query('order_id') order_id: string,@Query('run_id') run_id: string) {
    return this.appService.scheduleInvoiceGeneration(run_id,order_id);
  }

  @Put('/test/:test_id')
  async testPut(
    @Param('test_id') test_id: string,
    @Body() updateData: any, // Update data received as JSON
  ) {
    try {
      const updateResult = await mongo.upsertDocument(
        'test-responses',
        { "test_id" : test_id },
        updateData,
      );

      return updateData;
    } catch (error) {
      // Handle errors appropriately, e.g., log the error and throw a specific exception
      throw error;
    }
  }

  @Post('/test/')
  async testPost(
    @Body() postData: any, // Update data received as JSON
  ) {
    try {
      const result = await mongo.getCollectionBy("test-responses", {"test_id": "1"});
      return {
        response : result[0],
        request : postData
      };
    } catch (error) {
      // Handle errors appropriately, e.g., log the error and throw a specific exception
      throw error;
    }
  }

  @Get("/test/:test_id")
  async getSetings(@Param("test_id") test_id: string) {
      try {
        const result = await mongo.getCollectionBy("test-responses", {"test_id": test_id});
        return result[0];
      } catch (error) {
        utils.log(error)
      }
    }

}

function convertToCSV(run_id, items : any[]) {
  // Add header row
  const header = "sku,product_name,order_qty,available_qty,required"
  const csvContent = [];
  csvContent.push(header);

  // Loop through each order
  items.forEach(item => {
    // Add main header
    // Loop through each line item
      // No need to extract data, just create empty cells
    csvContent.push(`${item.sku},${item.product_name}, ${item.order_qty}, ${item.available_qty}, ${item.required}`);
    const csvString = csvContent.join('\n');

    // Write CSV to file
    fs.writeFileSync(`./${run_id}.csv`, csvString);
    console.log(`${run_id}.csv file created successfully!`);
  });

  return;
}
