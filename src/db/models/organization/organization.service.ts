import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Organization } from './organization.schema';
import { User } from '../user/user.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject('ORGANIZATION_MODEL')
    private model: Model<Organization>,
    @Inject('USER_MODEL')
    private userModal: Model<User>
  ) { }

  async create(organizationData: Organization): Promise<Organization> {
    const user = await this.userModal.findOne({id : organizationData.email});
    const createdOrganization = await this.model.create(organizationData);
    user.organization = createdOrganization._id;
    user.save();

    return createdOrganization;
  }

  async findAll(): Promise<Organization[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<Organization | null> {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, newData: Partial<Organization>): Promise<Organization | null> {
    const updatedOrganization = await this.model.findByIdAndUpdate(id, newData, { new: true }).exec();
    return updatedOrganization;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async checkByWebsite(website: string): Promise<Organization> {
    const organization = await this.model.findOne({ website }).exec();
    return organization;
  }
}