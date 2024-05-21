import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Merchant } from './merchant.schema';

@Injectable()
export class MerchantService {
  constructor(
    @Inject('MERCHANT_MODEL')
    private model: Model<Merchant>,
  ) {}

  async create(channelTypeData: Merchant): Promise<Merchant> {
    const createdChannelType = await this.model.create(channelTypeData);
    return createdChannelType;
  }

  async findAll(): Promise<Merchant[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<Merchant | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<Merchant>): Promise<Merchant | null> {
    const updatedChannelType = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedChannelType;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
