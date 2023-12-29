import { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { basePath } from '../../../../config/env';
import { createServer } from '../../../../config/server';
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

describe('given that data is send via post', () => {
  it('should return a 200 and create the feed', async () => {
    const { body, statusCode } = await supertest(app)
      .post(`${basePath}/actions/new-feed`)
      .send(feedPayload);
    expect(statusCode).toBe(200);
    expect(body.data).toMatchObject(feedPayload);
  });
});
