import { Request, Response } from 'express';
import FeedService from '../../../service/feed-service';
import buildLegacyResponse from '../../utils/build-legacy-response';
import { FeedDTO } from '../../utils/data-contracts';

export const newFeed = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as FeedDTO;

    const feed = await FeedService.saveFeed({ ...body });

    return res.status(200).json(
      buildLegacyResponse({
        status: 200,
        description: 'Feed was created successfully',
        data: feed,
      })
    );
  } catch (error) {
    return res.status(500).json(
      buildLegacyResponse({
        status: 500,
        description: error,
      })
    );
  }
};
