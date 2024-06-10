import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProductMapping } from '../models/product_mapping/product-mapping.schema';
import { ProductMappingService } from '../models/product_mapping/product-mapping.service';

@Controller('product_mapping')
export class ProductMappingController {
  constructor(private readonly service: ProductMappingService) {}

  @Post()
  async create(@Body() productMappingData: ProductMapping) {
    return this.service.create(productMappingData);
  }

  @Get()
  async findAll(): Promise<ProductMapping[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductMapping | null> {
    return this.service.findById(id);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() newData: Partial<ProductMapping>): Promise<ProductMapping | null> {
    return this.service.updateById(id, newData);
  }

}
