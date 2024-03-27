import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { InventoryController } from './controllers/inventory.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { MobileAppController } from './controllers/extension-app.controller';

@Module({
  imports: [],
  controllers: [AppController, OrdersController, InventoryController,InvoiceController,MobileAppController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
