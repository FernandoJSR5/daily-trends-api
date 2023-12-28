import { LegacyResponse } from 'api/utils/data-contracts';
import { Request, Response } from 'express';
import FeedService from '../../../services/feed-service';
import ScrapingService from '../../../services/scraping-service';
import Constants from '../../../utils/constants';
import buildLegacyResponse from '../../utils/build-legacy-response';

export const getFeeds = async (
  req: Request,
  res: Response<LegacyResponse>
): Promise<Response> => {
  try {
    let feeds;

    feeds = await FeedService.findFeeds();

    if (feeds.length === Constants.ZERO) {
      feeds = await ScrapingService.scrapingFeeds();
    }

    return res.status(200).json(
      buildLegacyResponse({
        status: 200,
        description: 'Feeds delivered successfully',
        data: feeds,
      })
    );
  } catch (error) {
    return res.sendStatus(500).json(
      buildLegacyResponse({
        status: 500,
        description: error,
      })
    );
  }
};
