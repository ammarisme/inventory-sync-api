import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { State } from '../models/state/state.schema';
import { StateService } from '../models/state/state.service';

@Controller('states')
export class StateController {
  constructor(private readonly service: StateService) {}

  @Post()
  async create(@Body() stateData: State) {
    return this.service.create(stateData);
  }

  @Get()
  async findAll(): Promise<State[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<State | null> {
    return this.service.findById(id);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() newData: Partial<State>): Promise<State | null> {
    return this.service.updateById(id, newData);
  }

}
