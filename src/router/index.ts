import express from 'express';
import users from './feeds';

const router = express.Router();

export default (): express.Router => {
  users(router);
  return router;
};
