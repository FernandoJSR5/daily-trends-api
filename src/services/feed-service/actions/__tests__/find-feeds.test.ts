import { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import FeedService from '../..';
import { basePath } from '../../../../config/env';
import { createServer } from '../../../../config/server';
import Constants from '../../../../utils/constants';

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

export const feedsPayload = [
  {
    _id: '658cbadcfa7c475dbe173a40',
    title: 'Titulo de portada',
    description: 'Prueba de concepto',
    author: 'Fernando Salazar',
    journal: 'El Periodico',
    link: 'http://localhost:8080/api-explorer/',
    createdAt: '2023-12-28T00:01:32.496Z',
    updatedAt: '2023-12-28T00:01:32.496Z',
    __v: 0,
  },
  {
    _id: '658cbadcfa7c475dbe173a41',
    title: 'Titulo de portada 2',
    description: 'Prueba de concepto 2',
    author: 'Fernando Salazar',
    journal: 'El Periodico',
    link: 'http://localhost:8080/api-explorer/',
    createdAt: '2023-12-29T00:01:32.496Z',
    updatedAt: '2023-12-29T00:01:32.496Z',
    __v: 0,
  },
];

describe('given that data is loaded in database', () => {
  it('should return 200 and two feeds', async () => {
    const findFeedsServiceMock = jest
      .spyOn(FeedService, 'findFeeds')
      // @ts-ignore
      .mockReturnValueOnce(feedsPayload);

    const { body, statusCode } = await supertest(app)
      .get(`${basePath}/actions/get-feeds`)
      .expect(200);

    expect(statusCode).toBe(200);

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data).not.toHaveLength(Constants.ZERO);

    expect(findFeedsServiceMock).toHaveBeenCalled();
  });
});

describe('given that was rejected find feeds service', () => {
  it('should return 500', async () => {
    const findFeedsServiceMock = jest
      .spyOn(FeedService, 'findFeeds')
      // @ts-ignore
      .mockRejectedValueOnce('Oh no, sorry, there was an error :(');

    const { body, statusCode } = await supertest(app)
      .get(`${basePath}/actions/get-feeds`)
      .expect(500);

    expect(statusCode).toBe(500);
    expect(body.description).toEqual('Oh no, sorry, there was an error :(');

    expect(findFeedsServiceMock).toHaveBeenCalled();
  });
});
