import * as dotenv from 'dotenv';
import * as env from 'env-var';
import path from 'path';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.join(__dirname, '..', '..', '.env.test'),
  });
} else {
  dotenv.config();
}

export const port = env.get('PORT').default('5000').asInt();
export const url = env.get('MONGO_URL').required().asString();
export const basePath = env.get('BASE_PATH').required().asString();
export const nodeEnv = env.get('NODE_ENV').required().asString();
