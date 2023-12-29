import { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { basePath } from '../../../../config/env';
import { createServer } from '../../../../config/server';
import { createFeed, deleteAll } from '../../../../db/feeds';
import Constants from '../../../../utils/constants';
import feedPayload from './feed-payload.json';

let app: Express;

beforeAll(async () => {
  app = await createServer();
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('given feeds not exist in the database (via scraping)', () => {
  it('should return a 200 status and multiple feeds', async () => {
    const { body, statusCode } = await supertest(app)
      .get(`${basePath}/actions/get-feeds`)
      .expect(200);

    expect(statusCode).toBe(200);

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data).not.toHaveLength(Constants.ZERO);
    expect(body.description).toBe('Feeds delivered successfully');
  });
});

describe('given feed does exist in the database', () => {
  it('should return a 200 status and one feed', async () => {
    await deleteAll();
    await createFeed(feedPayload);
    const { body, statusCode } = await supertest(app)
      .get(`${basePath}/actions/get-feeds`)
      .expect(200);

    expect(statusCode).toBe(200);
    expect(body.data[0]).toMatchObject(feedPayload);
  });
});
