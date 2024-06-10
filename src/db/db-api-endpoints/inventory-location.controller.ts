import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { InventoryLocationService } from '../models/inventory/inventory-location.service';
import { InventoryLocation } from '../models/inventory/inventory-location.schema';

@Controller('inventory-locations')
export class InventoryLocationController {
  constructor(private readonly inventoryLocationService: InventoryLocationService) {}

  @Post()
  async create(@Body() locationData: InventoryLocation): Promise<InventoryLocation> {
    return await this.inventoryLocationService.create(locationData);
  }

  @Get()
  async findAll(): Promise<InventoryLocation[]> {
    return await this.inventoryLocationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<InventoryLocation> {
    const location = await this.inventoryLocationService.findById(id);
    if (!location) {
      throw new NotFoundException('Inventory Location not found');
    }
    return location;
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() newData: Partial<InventoryLocation>): Promise<InventoryLocation> {
    const updatedLocation = await this.inventoryLocationService.updateById(id, newData);
    if (!updatedLocation) {
      throw new NotFoundException('Inventory Location not found');
    }
    return updatedLocation;
  }


}
