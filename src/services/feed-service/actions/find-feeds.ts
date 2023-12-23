import { getFeedsByDate } from '../../../db/feeds';

const findAFeeds = async () => {
  const today = new Date();

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDay(),
    0,
    0,
    0
  );

  currentDate.toLocaleDateString('es-ES');

  const feeds = await getFeedsByDate(currentDate.toISOString());
  return feeds;
};

export default findAFeeds;
