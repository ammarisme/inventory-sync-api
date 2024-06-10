import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OrganizationService } from '../models/organization/organization.service';
import { Organization } from '../models/organization/organization.schema';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Post()
  async create(@Body() organizationData: Organization) {
    return this.service.create(organizationData);
  }

  @Get()
  async findAll(): Promise<Organization[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Organization | null> {
    return this.service.findById(id);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() newData: Partial<Organization>): Promise<Organization | null> {
    return this.service.updateById(id, newData);
  }

  @Get('check/:website')
  async checkByWebsite(@Param('website') website: string): Promise<{ exists: boolean, organization : Organization }> {
    const organization = await this.service.checkByWebsite(website);
    const exists = !!organization
    return { exists : exists,
        organization : organization };
  }
}
