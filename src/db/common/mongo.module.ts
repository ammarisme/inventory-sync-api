import { Module } from '@nestjs/common';
import { mongoProviders } from './mongo.provider';
import { DatabaseModule } from './database.module';
import { CatService } from '../models/cat/cat.service';
import { CatsController } from 'src/db/db-api-endpoints/test.controller';
import { OrderService } from '../models/order/order.service';
import { OrderController } from '../db-api-endpoints/order.controller';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService, CatService, ...mongoProviders],
  controllers: [CatsController, OrderController]
})
export class MongoModule {}