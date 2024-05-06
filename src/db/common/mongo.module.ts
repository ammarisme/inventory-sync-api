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

@Module({
  imports: [DatabaseModule],
  providers: [OrderService, CatService, UserService, JourneyService, CustomerService, CourierService, CityService, StateService, ...mongoProviders],
  controllers: [CatsController, OrderController, UsersController, JourneyController, CustomersController, CourierController, CityController, StateController]
})
export class MongoModule {}