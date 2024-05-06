import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { State } from './state.schema';

@Injectable()
export class StateService {
  constructor(
    @Inject('STATE_MODEL')
    private model: Model<State>,
  ) { }

  async create(stateData: State): Promise<State> {
    const createdState = await this.model.create(stateData);
    return createdState;
  }

  async findAll(): Promise<State[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<State | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<State>): Promise<State | null> {
    const updatedState = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedState;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
