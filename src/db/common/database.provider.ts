import * as mongoose from 'mongoose';
import { mongo_url, mydb } from 'src/configs';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(mongo_url+"/"+mydb ,  {
        // add this line 
        authSource:"admin",
        
        }),
  }
];