import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { InventoryController } from './controllers/inventory.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { MobileAppController } from './controllers/extension-app.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { OldUserController } from './controllers/user.controller';
import { SharedFunctions } from './controllers/sample-controller';
import { MongoModule } from './db/common/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [AppController, OrdersController, InventoryController,InvoiceController,MobileAppController, DashboardController,
    OldUserController, SharedFunctions],
  providers: [AppService, OrdersService],
})
export class AppModule {}
