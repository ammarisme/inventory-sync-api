import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { OrderSource } from './order-source.schema';

@Injectable()
export class OrderSourceService {
  constructor(
    @Inject('ORDER_SOURCE_MODEL')
    private model: Model<OrderSource>,
  ) { }

  async create(orderSourceData: OrderSource): Promise<OrderSource> {
    const createdOrderSource = await this.model.create(orderSourceData);
    return createdOrderSource;
  }

  async findAll(): Promise<OrderSource[]> {
    return this.model.find().exec();
  }

  async findById(orderSourceId: string): Promise<OrderSource | null> {
    return this.model.findOne({ id: orderSourceId }).exec();
  }

  async updateById(id: string, newData: Partial<OrderSource>): Promise<OrderSource | null> {
    const updatedOrderSource = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedOrderSource;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
