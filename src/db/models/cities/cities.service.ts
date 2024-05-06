import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { City } from './cities.schema';

@Injectable()
export class CityService {
  constructor(
    @Inject('CITY_MODEL')
    private model: Model<City>,
  ) { }

  async create(cityData: City): Promise<City> {
    const createdCity = await this.model.create(cityData);
    return createdCity;
  }

  async findAll(): Promise<City[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<City | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<City>): Promise<City | null> {
    const updatedCity = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedCity;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
