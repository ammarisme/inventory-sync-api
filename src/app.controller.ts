import { Controller, Get, Res, Query } from '@nestjs/common';
import { AppService } from './app.service';
const fs = require('fs');


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("order-runs")
  getOrderRuns(): string {
    return this.appService.getOrderRuns();
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

  @Get("generate-invoice")
  generateInvoice(@Query('order_id') order_id: string,@Query('run_id') run_id: string) {
    return this.appService.scheduleInvoiceGeneration(run_id,order_id);
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
