import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Cat, CreateCatDto } from './cat.schema';

@Injectable()
export class CatService {
  constructor(
    @Inject('CAT_MODEL')
    private catModel: Model<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}