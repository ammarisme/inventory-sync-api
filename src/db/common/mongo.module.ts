import { Module } from '@nestjs/common';
import { mongoProviders } from './mongo.provider';
import { DatabaseModule } from './database.module';
import { CatService } from '../models/cat/cat.service';
import { CatsController } from 'src/db/db-api-endpoints/test.controller';
import { OrderService } from '../models/order/order.service';
import { OrderController } from '../db-api-endpoints/order.controller';
import { UsersController } from '../db-api-endpoints/user.controller';
import { UserService } from '../models/user/user.service';
import { JourneyService } from '../models/journey/journey.service';
import { JourneyController } from '../db-api-endpoints/journey.controller';
import { CustomerService } from '../models/customer/customer.service';
import { CustomersController } from '../db-api-endpoints/customer.controller';
import { CourierService } from '../models/courier/courier.service';
import { CourierController } from '../db-api-endpoints/courier.controller';
import { CityService } from '../models/cities/cities.service';
import { CityController } from '../db-api-endpoints/cities.controller.';
import { StateService } from '../models/state/state.service';
import { StateController } from '../db-api-endpoints/state.controller';
import { OrderSourceService } from '../models/order_source/order-source.service';
import { ProductMappingService } from '../models/product_mapping/product-mapping.service';
import { ProductMappingController } from '../db-api-endpoints/product-mapping.controller';
import { OrderSourceController } from '../db-api-endpoints/ordersource.controller';
import { InventoryLocationService } from '../models/inventory/inventory-location.service';
import { InventoryController } from 'src/controllers/inventory.controller';
import { InventoryLocationController } from '../db-api-endpoints/inventory-location.controller';
import { InventoryLocationTypeService } from '../models/inventory-location-types/inventory-location-type.service';
import { InventoryLocationTypeController } from '../db-api-endpoints/inventory-location-type.controller';
import { SalesChannelTypeService } from '../models/sales-channel-type/sales-channel-type.service.';
import { SalesChannelTypeController } from '../db-api-endpoints/sales-channel-type.controller';
import { MerchantService } from '../models/mechants/merchant.service.';
import { MerchantController } from '../db-api-endpoints/merchant.controller';
import { ReportService } from '../models/reports/reports.service';
import { ReportsController } from '../db-api-endpoints/reports.controller';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService, CatService, UserService, JourneyService, CustomerService,
     CourierService, CityService, StateService, OrderSourceService, ProductMappingService, InventoryLocationService, InventoryLocationTypeService,
    SalesChannelTypeService, MerchantService,ReportService,
     ...mongoProviders],
  controllers: [CatsController, OrderController, UsersController, JourneyController, CustomersController,
     CourierController, CityController, StateController, ProductMappingController, OrderSourceController, InventoryLocationController , InventoryLocationTypeController ,
     SalesChannelTypeController, MerchantController, ReportsController
    ]
})
export class MongoModule {}