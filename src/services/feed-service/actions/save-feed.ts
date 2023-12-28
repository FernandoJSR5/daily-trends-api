import { createFeed } from '../../../db/feeds';

const saveFeed = async (
  title: String,
  description: String,
  author: String,
  journal: String,
  link: String
) => {
  const feed = await createFeed({
    title,
    description,
    author,
    journal,
    link,
  });
  return feed;
};

export default saveFeed;
