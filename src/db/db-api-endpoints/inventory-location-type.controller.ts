import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InventoryLocationTypeService } from '../models/inventory-location-types/inventory-location-type.service';
import { InventoryLocationType } from '../models/inventory-location-types/inventory-location-type.schema';

@Controller('inventory-location-types')
export class InventoryLocationTypeController {
  constructor(private readonly service: InventoryLocationTypeService) {}

  @Post()
  async create(@Body() createInventoryLocationTypeDto: InventoryLocationType): Promise<InventoryLocationType> {
    return this.service.create(createInventoryLocationTypeDto);
  }

  @Get()
  async findAll(): Promise<InventoryLocationType[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<InventoryLocationType | null> {
    return this.service.findById(id);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateInventoryLocationTypeDto: Partial<InventoryLocationType>,
  ): Promise<InventoryLocationType | null> {
    return this.service.updateById(id, updateInventoryLocationTypeDto);
  }

}
