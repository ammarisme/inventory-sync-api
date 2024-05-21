import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InventoryLocationType } from './inventory-location-type.schema';

@Injectable()
export class InventoryLocationTypeService {
  constructor(
    @Inject('INVENTORY_LOCATION_TYPE_MODEL')
    private model: Model<InventoryLocationType>,
  ) {}

  async create(typeData: InventoryLocationType): Promise<InventoryLocationType> {
    const createdType = await this.model.create(typeData);
    return createdType;
  }

  async findAll(): Promise<InventoryLocationType[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<InventoryLocationType | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<InventoryLocationType>): Promise<InventoryLocationType | null> {
    const updatedType = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedType;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
