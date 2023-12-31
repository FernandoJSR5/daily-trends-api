import { FeedSchema } from 'api/utils/data-contracts';
import { getFeedsByDate } from '../../../db/feeds';
import { getDate } from '../../../utils/index';

const findFeeds = async (): Promise<FeedSchema[]> => {
  const initDate = getDate(0, 0, 0, 0);

  const finalDate = getDate(23, 59, 59, 59);

  const feeds = await getFeedsByDate(initDate, finalDate);
  return feeds;
};

export default findFeeds;
