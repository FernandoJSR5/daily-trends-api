import { Request, Response } from 'express';
import ScrapingService from '../../../services/scraping-service';

export const getFeeds = async (req: Request, res: Response): Promise<Response> => {
  try {
    let feeds;
    // feeds = await FeedService.findFeeds();
    feeds = await ScrapingService.scrapingFeeds();

    // if (feeds.length === Constants.ZERO) {
    // }

    return res.status(200).json(feeds);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
