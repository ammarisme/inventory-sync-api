import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Revenue } from './revenue.schema';

@Injectable()
export class RevenueService {
  constructor(
    @Inject('REVENUE_MODEL')
    private model: Model<Revenue>,
  ) { }

  async create(revenueData: Revenue): Promise<Revenue> {
    const createdRevenue = await this.model.create(revenueData);
    return createdRevenue;
  }

  async findAll(): Promise<Revenue[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<Revenue | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<Revenue>): Promise<Revenue | null> {
    const updatedRevenue = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedRevenue;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
