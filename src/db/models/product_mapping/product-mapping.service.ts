import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { ProductMapping } from './product-mapping.schema';

@Injectable()
export class ProductMappingService {
  constructor(
    @Inject('PRODUCT_MAPPING_MODEL')
    private model: Model<ProductMapping>,
  ) { }

  async create(productMappingData: ProductMapping): Promise<ProductMapping> {
    const createdProductMapping = await this.model.create(productMappingData);
    return createdProductMapping;
  }

  async findAll(): Promise<ProductMapping[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<ProductMapping | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<ProductMapping>): Promise<ProductMapping | null> {
    const updatedProductMapping = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedProductMapping;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
