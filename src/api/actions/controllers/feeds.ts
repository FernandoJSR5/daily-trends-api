import { Request, Response } from 'express';
import FeedService from '../../../services/feed-service';
import ScrapingService from '../../../services/scraping-service';
import Constants from '../../../utils/constants';

export const getFeeds = async (req: Request, res: Response): Promise<Response> => {
  try {
    let feeds;

    feeds = await FeedService.findFeeds();

    if (feeds.length === Constants.ZERO) {
      feeds = await ScrapingService.scrapingFeeds();
    }

    return res.status(200).json(feeds);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
