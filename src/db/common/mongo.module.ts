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

@Module({
  imports: [DatabaseModule],
  providers: [OrderService, CatService, UserService, JourneyService, ...mongoProviders],
  controllers: [CatsController, OrderController, UsersController, JourneyController]
})
export class MongoModule {}