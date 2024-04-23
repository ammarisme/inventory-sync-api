import { Connection } from 'mongoose';
import { CatSchema } from '../models/cat/cat.schema';
import { OrderSchema } from '../models/order/order.schema';
import { UserSchema } from '../models/user/user.schema';
import { JourneySchema } from '../models/journey/journey.schema';

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
];