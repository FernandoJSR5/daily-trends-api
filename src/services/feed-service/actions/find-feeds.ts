import { getFeeds } from '../../../db/feeds';

const findAllFeeds = async () => {
  const feeds = await getFeeds();
  return feeds;
};

export default findAllFeeds;
