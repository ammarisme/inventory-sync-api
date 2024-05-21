import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { SalesChannelType } from './sales-channel-type.schema';

@Injectable()
export class SalesChannelTypeService {
  constructor(
    @Inject('SALES_CHANNEL_TYPE_MODEL')
    private model: Model<SalesChannelType>,
  ) {}

  async create(channelTypeData: SalesChannelType): Promise<SalesChannelType> {
    const createdChannelType = await this.model.create(channelTypeData);
    return createdChannelType;
  }

  async findAll(): Promise<SalesChannelType[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<SalesChannelType | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<SalesChannelType>): Promise<SalesChannelType | null> {
    const updatedChannelType = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedChannelType;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
