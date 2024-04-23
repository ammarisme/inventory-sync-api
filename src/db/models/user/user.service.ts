import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { AuthenticateUserDto, CreateUserDto, User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private model: Model<User>,
  ) { }

  async authenticate(authenticateDto: AuthenticateUserDto): Promise<Object> {
    const user = await this.model.findOne({ email: authenticateDto.email, password: authenticateDto.password }, {_id : 0}).exec();
    if (!user) {
      return {
        authenticated: false
      }
    } else {
      return {
        authenticated: true,
        user: user
      }
    }
  }

  async findBy(filter): Promise<User | null> {
    return this.model.findOne(filter).exec();
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this.model.findOne({ email: dto.email }).exec();

      if (!user) {
        const createdCat = new this.model(dto);
        return createdCat.save();
      } else {
        throw new Error(`A user already exists with this email`);
      }
    } catch (error) {
      // log(error)
    }
  }
}