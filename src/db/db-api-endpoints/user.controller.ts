import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';

import { AuthenticateUserDto, CreateUserDto } from '../models/user/user.schema';
import { UserService } from '../models/user/user.service';


@Controller('users')
export class UsersController {
  constructor(private readonly service: UserService) {}

  @Post("/authenticate")
  async authenticate(@Body() authDto: AuthenticateUserDto) {
    const authenticated = await this.service.authenticate(authDto);
    return authenticated
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {dto.id = dto.email;
      dto.id = dto.email;
      const user = await this.service.create(dto);
      return user!=null ? user : "User already exist"
  }

  @Get("/get_riders")
  async getRiders() {
      const user = await this.service.findAllBy({
        is_rider : true
      });
      return user!=null ? user : "No riders"
  }
}