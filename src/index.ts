import mongoose from 'mongoose';
import routes from './api/routes';
import { MONGO_URL, port } from './config/env';
import Server from './config/server';

const run = async () => {
  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL).then(
    () => {
      console.log('🔌 Database connection was successful! 🔌');
    },
    (error: Error) => {
      console.log(`❌ ${error} ❌`);
    }
  );
  (await new Server().router(routes)).listen(port);
};

run();
