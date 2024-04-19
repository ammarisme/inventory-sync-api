import { Controller, Get, Post, Body } from '@nestjs/common';
import { Cat, CreateCatDto } from 'src/db/models/cat/cat.schema';
import { CatService } from 'src/db/models/cat/cat.service';


@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}