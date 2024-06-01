import { Connection } from 'mongoose';
import { CatSchema } from '../models/cat/cat.schema';
import { OrderSchema } from '../models/order/order.schema';
import { UserSchema } from '../models/user/user.schema';
import { JourneySchema } from '../models/journey/journey.schema';
import { CustomerSchema } from '../models/customer/customer.schema';
import { CourierSchema } from '../models/courier/courier.schema';
import { CitySchema } from '../models/cities/cities.schema';
import { StateSchema } from '../models/state/state.schema';
import { OrderSourceSchema } from '../models/order_source/order-source.schema';
import { ProductMapping, ProductMappingSchema } from '../models/product_mapping/product-mapping.schema';
import { InventoryLocationSchema } from '../models/inventory/inventory-location.schema';
import { InventoryLocationTypeSchema } from '../models/inventory-location-types/inventory-location-type.schema';
import { SalesChannelTypeSchema } from '../models/sales-channel-type/sales-channel-type.schema';
import { MerchantSchema } from '../models/mechants/merchant.schema';
import { OrganizationSchema } from '../models/organization/organization.schema';

export const mongoProviders = [
  {
    provide: 'CAT_MODEL',
    useFactory: (connection: Connection) => connection.model('Cat', CatSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) => connection.model('Order', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'JOURNEY_MODEL',
    useFactory: (connection: Connection) => connection.model('Journey', JourneySchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CUSTOMER_MODEL',
    useFactory: (connection: Connection) => connection.model('Customer', CustomerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'COURIER_MODEL',
    useFactory: (connection: Connection) => connection.model('Courier', CourierSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CITY_MODEL',
    useFactory: (connection: Connection) => connection.model('Cities', CitySchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'STATE_MODEL',
    useFactory: (connection: Connection) => connection.model('State', StateSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ORDER_SOURCE_MODEL',
    useFactory: (connection: Connection) => connection.model('OrderSource', OrderSourceSchema),
    inject: ['DATABASE_CONNECTION'],
  },

  {
    provide: 'PRODUCT_MAPPING_MODEL',
    useFactory: (connection: Connection) => connection.model('ProductMapping', ProductMappingSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  
  {
    provide: 'INVENTORY_LOCATION_MODEL',
    useFactory: (connection: Connection) => connection.model('InventoryLocation', InventoryLocationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'INVENTORY_LOCATION_TYPE_MODEL',
    useFactory: (connection: Connection) => connection.model('InventoryLocationType', InventoryLocationTypeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SALES_CHANNEL_TYPE_MODEL',
    useFactory: (connection: Connection) => connection.model('SalesChannelType', SalesChannelTypeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'MERCHANT_MODEL',
    useFactory: (connection: Connection) => connection.model('MerchantSchema', MerchantSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ORGANIZATION_MODEL',
    useFactory: (connection: Connection) => connection.model('OrganizationSchema', OrganizationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];