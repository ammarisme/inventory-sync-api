import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";

@Controller("extension-app")
export class MobileAppController {

  @Get("/settings/:app_id")
async getSetings(@Param("app_id") app_id: string) {
    try {
      const result = await mongo.getCollectionBy("extension-app", {app_id: app_id});
      return result[0];
    } catch (error) {
      utils.log(error)
    }
  }

  @Put('/settings/:app_id')
  async updateSettings(
    @Param('app_id') app_id: string,
    @Body() updateData: any, // Update data received as JSON
  ) {
    try {
      const updateResult = await mongo.upsertDocument(
        'extension-app',
        { app_id },
        updateData,
      );

      return updateResult;
    } catch (error) {
      // Handle errors appropriately, e.g., log the error and throw a specific exception
      throw error;
    }
  }
}