import { Controller, Post, UploadedFile, UseInterceptors, Res, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { OrdersService } from '../services/orders.service'; // Replace with your service name
import mongo = require("../services/mongo.service");

@Controller('import')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/', // Change this to your desired upload directory
        filename: (req, file, cb) => {
          randomBytes(16, (err, buffer) => {
            const randomFilename = buffer.toString('hex');
            cb(err, `${randomFilename}_daraz.csv`); // Assuming the file is CSV
          });
        },
      }),
    })
  )
  async uploadOrders(@UploadedFile() file: Express.Multer.File, @Body() body: { source: string }) {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    const { source } = body;

    if (source !== 'daraz') {
      return { message: 'Currently only Daraz imports are supported' };
    }

    const data = await this.ordersService.processDarazOrders(file.path); // Call service to process orders

    return { message: 'Orders imported successfully' };
  }


  
}
