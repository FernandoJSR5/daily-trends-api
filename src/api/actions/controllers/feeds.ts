import { LegacyResponse } from 'api/utils/data-contracts';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import logger from '../../../config/logger';
import FeedService from '../../../services/feed-service';
import ScrapingService from '../../../services/scraping-service';
import Constants from '../../../utils/constants';
import buildLegacyResponse from '../../utils/build-legacy-response';

export const getFeeds = async (
  req: Request,
  res: Response<LegacyResponse>
): Promise<Response> => {
  const action = 'find feeds';
  const start = new Date().getTime();

  const childLogger = logger.child({
    trackId: uuid(),
    action,
  });

  childLogger.info({
    message: 'Find feeds in database by current date',
    responseTimeMS: Date.now() - start,
  });

  try {
    let feeds;

    feeds = await FeedService.findFeeds();

    if (feeds.length === Constants.ZERO) {
      childLogger.info({
        message:
          'No feeds in database!. Begin process to scraping web pages to get feeds and save them in database',
        responseTimeMS: Date.now() - start,
      });
      feeds = await ScrapingService.scrapingFeeds();
    }

    childLogger.info({
      message: 'Feeds was delivered successfully',
      result: feeds,
      responseTimeMS: Date.now() - start,
      status: 200,
    });

    return res.status(200).json(
      buildLegacyResponse({
        status: 200,
        description: 'Feeds delivered successfully',
        data: feeds,
      })
    );
  } catch (error) {
    childLogger.info({
      message: `Feeds were not devilvered. ${error}`,
      responseTimeMS: Date.now() - start,
      status: 500,
    });
    return res.status(500).json(
      buildLegacyResponse({
        status: 500,
        description: error,
      })
    );
  }
};
