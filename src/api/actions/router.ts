import { Router } from 'express';
import { getFeeds } from './controllers/feeds';

const router = Router();

router.get('/get-feeds', getFeeds);

export default router;
