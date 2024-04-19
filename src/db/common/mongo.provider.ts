import { Connection } from 'mongoose';
import { CatSchema } from '../models/cat/cat.schema';
import { OrderSchema } from '../models/order/order.schema';

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
];