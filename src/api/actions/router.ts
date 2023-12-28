import { Router } from 'express';
import { newFeed } from './controllers/feed';
import { getFeeds } from './controllers/feeds';

const router = Router();

router.get('/get-feeds', getFeeds);
router.post('/new-feed', newFeed);

export default router;
