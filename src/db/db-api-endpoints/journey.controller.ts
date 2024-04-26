import { Controller, Post, Body, Param, Put, Get } from '@nestjs/common';
import { JourneyService } from '../models/journey/journey.service';
import { CreateJourneyDto, Journey } from '../models/journey/journey.schema';
import { UserService } from '../models/user/user.service';

@Controller('journeys')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService,
    private readonly userService: UserService,

  ) {}

  @Post()
  async createJourney(@Body() journeyData: CreateJourneyDto) {
    try {
      // Check if user_id exists in journeyData
      if (!journeyData.rider_id) {
        return { error: 'User ID is required to create a journey' };
      }

      // Fetch user from users collection based on user_id
      const user = await this.userService.findBy({id : journeyData.rider_id});
      if (!user) {
        return { error: 'User not found' };
      }

      // Assign user ObjectId to the rider field in journeyData
      journeyData.rider = user._id;

      // Create journey with updated journeyData
      const createdJourney = await this.journeyService.create(journeyData);
      return createdJourney;
    } catch (error) {
      console.error(error);
      return { error: 'Failed to create journey' };
    }
  }

  @Post(':journeyId/orders')
  async addOrdersToJourney(@Param('journeyId') journeyId: string, @Body() data) {
    try {
      const result = await this.journeyService.updateOrders(journeyId, data.orderIds);
      return result;
    } catch (error) {
      console.error(error);
      return { error: 'Failed to add orders to journey' };
    }
  }

  @Put(':journeyId/start-journey')
  async startJourney(@Param('journeyId') journeyId: string) {
    try {
      const result = await this.journeyService.startJourney(journeyId);
      return result;
    } catch (error) {
      console.error(error);
      return { error: 'Failed to add orders to journey' };
    }
  }

  @Put(':journeyId/end-journey')
  async endJourney(@Param('journeyId') journeyId: string) {
    try {
      const result = await this.journeyService.endJourney(journeyId);
      return result;
    } catch (error) {
      console.error(error);
      return { error: 'Failed to add orders to journey' };
    }
  }


  @Get(':journeyId')
  async getJourney(@Param('journeyId') journeyId: string) {
    try {
      const result = await this.journeyService.getJourney(journeyId);
      return result;
    } catch (error) {
      return { error: error };
    }
  }

  @Get('getorcreate/:rider_id') // Change the route to avoid conflicts
  async getOrCreateJourneyByRider(@Param('rider_id') rider_id: string) {
    try {
      const result = await this.journeyService.getOrCreateJourneyByRider(rider_id);
      return result;
    } catch (error) {
      return { error: error };
    }
  }

  
}
