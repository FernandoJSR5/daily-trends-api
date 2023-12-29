import { Express } from 'express';
import supertest from 'supertest';
import FeedService from '../..';
import { basePath } from '../../../../config/env';
import { createServer } from '../../../../config/server';

let app: Express;

beforeAll(async () => {
  app = await createServer();
});

export const feedInput = {
  title: 'Titulo de portada',
  description: 'Prueba de concepto',
  author: 'Fernando Salazar',
  journal: 'El Periodico',
  link: 'http://localhost:8080/api-explorer/',
};

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

describe('given that data is send manually', () => {
  it('should return 200 and feed payload', async () => {
    const createFeedServiceMock = jest
      .spyOn(FeedService, 'saveFeed')
      // @ts-ignore
      .mockReturnValueOnce(feedPayload);

    const { statusCode, body } = await supertest(app)
      .post(`${basePath}/actions/new-feed`)
      .send(feedInput);

    expect(statusCode).toBe(200);

    expect(body.data).toStrictEqual(feedPayload);

    expect(createFeedServiceMock).toHaveBeenCalledWith(feedInput);
  });
});

describe('given that was rejected save feeds service', () => {
  it('should return 500', async () => {
    const createFeedServiceMock = jest
      .spyOn(FeedService, 'saveFeed')
      // @ts-ignore
      .mockRejectedValueOnce('Oh no, sorry, there was an error :(');

    const { statusCode, body } = await supertest(app)
      .post(`${basePath}/actions/new-feed`)
      .send(feedInput);

    expect(statusCode).toBe(500);
    expect(body.description).toEqual('Oh no, sorry, there was an error :(');

    expect(createFeedServiceMock).toHaveBeenCalled();
  });
});
