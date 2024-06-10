import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SalesChannelTypeService } from '../models/sales-channel-type/sales-channel-type.service.';
import { SalesChannelType } from '../models/sales-channel-type/sales-channel-type.schema';

@Controller('sales-channel-types')
export class SalesChannelTypeController {
  constructor(private readonly salesChannelTypeService: SalesChannelTypeService) {}

  @Post()
  async create(@Body() createSalesChannelTypeDto: SalesChannelType): Promise<SalesChannelType> {
    return this.salesChannelTypeService.create(createSalesChannelTypeDto);
  }

  @Get()
  async findAll(): Promise<SalesChannelType[]> {
    return this.salesChannelTypeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<SalesChannelType | null> {
    return this.salesChannelTypeService.findById(id);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() updateSalesChannelTypeDto: Partial<SalesChannelType>): Promise<SalesChannelType | null> {
    return this.salesChannelTypeService.updateById(id, updateSalesChannelTypeDto);
  }

 
}
