import { Request, Response } from 'express';
import FeedService from '../../../services/feed-service';
import buildLegacyResponse from '../../utils/build-legacy-response';
import { FeedDTO } from '../../utils/data-contracts';

export const newFeed = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, author, journal, link } = req.body as FeedDTO;

    const feed = await FeedService.saveFeed(title, description, author, journal, link);

    return res.status(200).json(
      buildLegacyResponse({
        status: 200,
        description: 'Feed was created successfully',
        data: feed,
      })
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).json(
      buildLegacyResponse({
        status: 500,
        description: error,
      })
    );
  }
};
