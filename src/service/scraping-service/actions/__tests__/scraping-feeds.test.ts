import { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { basePath } from '../../../../config/env';
import { createServer } from '../../../../config/server';
import ScrapingService from '../../../scraping-service';

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

export const feedPayload = {
  _id: '658cbadcfa7c475dbe173a40',
  title: 'Titulo de portada',
  description: 'Prueba de concepto',
  author: 'Fernando Salazar',
  journal: 'El Periodico',
  link: 'http://localhost:8080/api-explorer/',
  createdAt: '2023-12-28T00:01:32.496Z',
  updatedAt: '2023-12-28T00:01:32.496Z',
  __v: 0,
};

describe('given that data base is empty, do scraping in web pages', () => {
  it('should return feed payload', async () => {
    const ScrapingServiceMock = jest
      .spyOn(ScrapingService, 'scrapingFeeds')
      // @ts-ignore
      .mockReturnValueOnce([feedPayload]);

    const { body, statusCode } = await supertest(app)
      .get(`${basePath}/actions/get-feeds`)
      .expect(200);

    expect(statusCode).toBe(200);

    expect(body.data[0]).toStrictEqual(feedPayload);

    expect(ScrapingServiceMock).toHaveBeenCalledWith();
  });
});

describe('given that was rejected scraping feeds service', () => {
  it('should return 500', async () => {
    const ScrapingServiceMock = jest
      .spyOn(ScrapingService, 'scrapingFeeds')
      // @ts-ignore
      .mockRejectedValueOnce('Oh no, sorry, there was an error :(');

    const { statusCode, body } = await supertest(app)
      .get(`${basePath}/actions/get-feeds`)
      .expect(500);

    expect(statusCode).toBe(500);
    expect(body.description).toEqual('Oh no, sorry, there was an error :(');

    expect(ScrapingServiceMock).toHaveBeenCalled();
  });
});
