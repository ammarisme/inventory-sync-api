import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Courier } from './courier.schema';

@Injectable()
export class CourierService {
  constructor(
    @Inject('COURIER_MODEL')
    private model: Model<Courier>,
  ) { }

  async create(courierData: Courier): Promise<Courier> {
    const createdCourier = await this.model.create(courierData);
    return createdCourier;
  }

  async findAll(): Promise<Courier[]> {
    return this.model.find().exec();
  }

  async findById(courier_id: string): Promise<Courier | null> {
    return this.model.findOne({id : courier_id}).exec();
  }

  async updateById(id: string, newData: Partial<Courier>): Promise<Courier | null> {
    const updatedCourier = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedCourier;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
