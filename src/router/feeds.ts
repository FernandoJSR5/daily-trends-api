import express from 'express';

import { getAllFeeds } from '../api/feeds';

export default (router: express.Router) => {
  router.get('/feeds', getAllFeeds);
};
