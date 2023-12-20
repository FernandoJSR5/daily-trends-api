import express from 'express';
import { getFeeds } from '../db/feeds';

export const getAllFeeds = async (req: express.Request, res: express.Response) => {
  try {
    const feeds = await getFeeds();
    return res.status(200).json(feeds);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
