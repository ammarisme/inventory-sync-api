import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { Merchant } from '../models/mechants/merchant.schema';
import { MerchantService } from '../models/mechants/merchant.service.';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  async create(@Body() merchantData: Merchant): Promise<Merchant> {
    return this.merchantService.create(merchantData);
  }

  @Get()
  async findAll(): Promise<Merchant[]> {
    return this.merchantService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') merchantId: string): Promise<Merchant | null> {
    return this.merchantService.findById(merchantId);
  }

  @Patch(':id')
  async updateById(@Param('id') merchantId: string, @Body() newData: Partial<Merchant>): Promise<Merchant | null> {
    return this.merchantService.updateById(merchantId, newData);
  }

}
