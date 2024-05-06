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
];