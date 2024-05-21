import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InventoryLocation } from './inventory-location.schema';

@Injectable()
export class InventoryLocationService {
  constructor(
    @Inject('INVENTORY_LOCATION_MODEL')
    private model: Model<InventoryLocation>,
  ) { }

  async create(locationData: InventoryLocation): Promise<InventoryLocation> {
    const createdLocation = await this.model.create(locationData);
    return createdLocation;
  }

  async findAll(): Promise<InventoryLocation[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<InventoryLocation | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<InventoryLocation>): Promise<InventoryLocation | null> {
    const updatedLocation = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedLocation;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
