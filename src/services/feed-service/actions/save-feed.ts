import { FeedDTO, FeedSchema } from 'api/utils/data-contracts';
import { createFeed } from '../../../db/feeds';

const saveFeed = async (feedDTO: FeedDTO): Promise<FeedSchema> => {
  try {
    const feed = await createFeed(feedDTO);
    return feed;
  } catch (error) {
    throw error;
  }
};

export default saveFeed;
