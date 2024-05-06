import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { City } from '../models/cities/cities.schema';
import { CityService } from '../models/cities/cities.service';

@Controller('cities')
export class CityController {
  constructor(private readonly service: CityService) {}

  @Post()
  async create(@Body() cityData: City) {
    return this.service.create(cityData);
  }

  @Get()
  async findAll(): Promise<City[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<City | null> {
    return this.service.findById(id);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() newData: Partial<City>): Promise<City | null> {
    return this.service.updateById(id, newData);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<boolean> {
    return this.service.deleteById(id);
  }
}
