import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

@Controller("shared-functions")
export class SharedFunctions {

  @Post("/execute")
  async execute(@Body() function_params: any) {
    try {
      const targetFunction = require(`./functions/${function_params.id}`);
      const result=  targetFunction.default(function_params.parameters); // Execute the function
      return result

    } catch (error) {
      utils.log(error)
    }
  }
}