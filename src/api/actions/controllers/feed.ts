import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import logger from '../../../config/logger';
import FeedService from '../../../services/feed-service';
import buildLegacyResponse from '../../utils/build-legacy-response';
import { FeedDTO } from '../../utils/data-contracts';

export const newFeed = async (req: Request, res: Response): Promise<Response> => {
  const body = req.body as FeedDTO;
  const action = 'save feed';
  const start = new Date().getTime();

  const childLogger = logger.child({
    trackId: uuid(),
    action,
    body,
  });

  childLogger.info({
    message: 'Feed to save in database',
    responseTimeMS: Date.now() - start,
  });
  try {
    const feed = await FeedService.saveFeed({ ...body });

    childLogger.info({
      message: 'Feed was saved in database successfully',
      result: feed,
      responseTimeMS: Date.now() - start,
      status: 200,
    });

    return res.status(200).json(
      buildLegacyResponse({
        status: 200,
        description: 'Feed was created successfully',
        data: feed,
      })
    );
  } catch (error) {
    childLogger.info({
      message: `Feed was not saved in database. ${error}`,
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
