import routes from './api/routes';
import { port } from './config/env';
import Server from './config/server';
import ScrapingService from './services/scraping-service';

const run = async () => {
  (await new Server().router(routes)).listen(port);
  ScrapingService.scrapingFeeds();
};

run();

// // const MONGO_URL = url;

// // mongoose.Promise = Promise;
// // mongoose.connect(MONGO_URL);
// // mongoose.connection.on('error', (error: Error) => {
// //   console.log(error);
// // });
