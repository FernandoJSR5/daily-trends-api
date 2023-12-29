import puppeteer from 'puppeteer';
import { FeedDTO } from '../../../api/utils/data-contracts';
import { createFeed } from '../../../db/feeds';
import Constants from '../../../utils/constants';
import { buildFeed } from '../../../utils/index';

const scrapingFeeds = async () => {
  let navigateOnePage = async () => {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
      });

      await page.goto(Constants.FIRST_URL, { waitUntil: 'networkidle2' });

      new Promise((page) => setTimeout(page, randomIntFromInterval(1000, 2000)));

      const firstFeeds = await saveFeedsOfOnePage(page);

      const secondFeeds = await navegateToSecondPage(page);

      const result = firstFeeds.concat(secondFeeds);

      await page.close();

      return result;
    } catch (error) {
      throw error;
    }
  };

  const main = async () => {
    const result = await navigateOnePage();
    return result;
  };

  const result = await main();
  return result;
};

const navegateToSecondPage = async (page: any) => {
  await page.goto(Constants.SECOND_URL, { waitUntil: 'networkidle2' });
  new Promise((page) => setTimeout(page, randomIntFromInterval(1000, 2000)));
  const feeds = await saveFeedsOfSecondPage(page);
  return feeds;
};

const saveFeedsOfOnePage = async (page: any) => {
  let feeds: any[] = [];

  await clickOnCookiePolicy(page);

  const sections = await page.$x(`//main[@class="mw mw-mc"]/div[1]/section/div`);

  if (sections.length > Constants.ZERO) {
    for (let index1 = 0; index1 < sections.length; index1++) {
      const articles = await page.$x(
        `//main[@class="mw mw-mc"]/div[1]/section/div[${index1 + 1}]/ ${
          index1 === Constants.TWO ? 'div/' : ''
        }  article`
      );
      if (articles.length > Constants.ZERO) {
        if (articles.length > Constants.ZERO) {
          for (let index2 = 0; index2 < articles.length; index2++) {
            const xpath = `//main[@class="mw mw-mc"]/div[1]/section/div[${
              index1 + 1
            }]/  ${index1 === Constants.TWO ? 'div/' : ''}  article[${index2 + 1}]`;
            let author: String = '';
            let title: String = '';
            let description: String = '';
            let link: String = '';

            const links = await page.$x(`${xpath}/header/h2/a`);
            if (links.length > Constants.ZERO) {
              link = (await page.evaluate((el: any) => el.href, links[0])) as string;
            }

            const titles = await page.$x(`${xpath}/header/h2`);
            if (titles.length > Constants.ZERO) {
              title = (await page.evaluate(
                (el: any) => el.innerText,
                titles[0]
              )) as string;
            }

            const authors = await page.$x(`${xpath}/div/a`);
            if (authors.length > Constants.ZERO) {
              author = (await page.evaluate(
                (el: any) => el.innerText,
                authors[0]
              )) as string;
            }

            const descriptions = await page.$x(`${xpath}/p`);
            if (descriptions.length > Constants.ZERO) {
              description = (await page.evaluate(
                (el: any) => el.innerText,
                descriptions[0]
              )) as string;
            }

            const feed: FeedDTO = buildFeed(
              author,
              title,
              description,
              link,
              Constants.FIRST_PAGE
            );

            await saveFeed(feed, feeds);
          }
        }
      }
    }
  }

  return feeds;
};

const saveFeedsOfSecondPage = async (page: any) => {
  let feeds: any[] = [];

  const mainPath = `//div[@class="ue-l-cg ue-l-cg--no-divider"][2]/div/div/div/div/div[2]/div`;
  await clickOnCookiePolicy(page);

  await page.content();
  const sections = await page.$x(mainPath);
  if (sections.length > Constants.ZERO) {
    for (let index1 = 0; index1 < sections.length; index1++) {
      const subsections = await page.$x(`${mainPath}[${index1 + 1}]/div`);
      if (subsections.length > Constants.ZERO) {
        for (let index2 = 0; index2 < subsections.length; index2++) {
          let author: String = '';
          let title: String = '';
          let description: String = '';
          let link: String = '';
          if (index1 === Constants.ONE) {
            let filteredAuthor: String = '';
            const article = await page.$x(
              `${mainPath}[${index1 + 1}]/div[${index2 + 1}]/article`
            );
            if (article.length == Constants.ONE) {
              const articleXPath = `${mainPath}[${index1 + 1}]/div[${
                index2 + 1
              }]/article`;

              const links = await page.$x(`${articleXPath}/a`);
              if (links.length > Constants.ZERO) {
                link = (await page.evaluate((el: any) => el.href, links[0])) as string;
              }

              const titles = await page.$x(`${articleXPath}/div/div/header/a/h2`);
              if (titles.length > Constants.ZERO) {
                title = (await page.evaluate(
                  (el: any) => el.innerText,
                  titles[0]
                )) as string;
              }

              const authors = await page.$x(`${articleXPath}/div/div/div/ul/li/span`);
              if (authors.length > Constants.ZERO) {
                author = (await page.evaluate(
                  (el: any) => el.innerText,
                  authors[0]
                )) as string;
                filteredAuthor = author.replace('REDACCIÓN:\n', '');
              }
            }

            const feed: FeedDTO = buildFeed(
              filteredAuthor,
              title,
              description,
              link,
              Constants.SECOND_PAGE
            );

            await saveFeed(feed, feeds);
          } else {
            const sectionOfSubsection = await page.$x(
              `${mainPath}[${index1 + 1}]/div[${index2 + 1}]/div`
            );
            if (sectionOfSubsection.length > Constants.ZERO) {
              for (let index3 = 0; index3 < sectionOfSubsection.length; index3++) {
                const article = await page.$x(
                  `${mainPath}[${index1 + 1}]/div[${index2 + 1}]/div[${
                    index3 + 1
                  }]/article`
                );
                if (article.length == Constants.ONE) {
                  const articleXPath = `${mainPath}[${index1 + 1}]/div[${
                    index2 + 1
                  }]/div[${index3 + 1}]/article`;

                  const links = await page.$x(`${articleXPath}/a`);
                  if (links.length > Constants.ZERO) {
                    link = (await page.evaluate(
                      (el: any) => el.href,
                      links[0]
                    )) as string;
                  }

                  const titles = await page.$x(`${articleXPath}/div/div/header/a/h2`);
                  if (titles.length > Constants.ZERO) {
                    title = (await page.evaluate(
                      (el: any) => el.innerText,
                      titles[0]
                    )) as string;
                  }

                  const authors = await page.$x(
                    `${articleXPath}/div/div/div/ul/li/span/a`
                  );
                  if (authors.length > Constants.ZERO) {
                    author = (await page.evaluate(
                      (el: any) => el.innerText,
                      authors[0]
                    )) as string;
                  }
                }

                const feed: FeedDTO = buildFeed(
                  author,
                  title,
                  description,
                  link,
                  Constants.SECOND_PAGE
                );

                await saveFeed(feed, feeds);
              }
            }
          }
        }
      }
    }
  }

  return feeds;
};

const saveFeed = async (feedDTO: FeedDTO, feeds: any) => {
  try {
    const feed = await createFeed(feedDTO);
    feeds.push(feed);
  } catch (error) {
    throw error;
  }
};

const clickOnCookiePolicy = async (page: any) => {
  const buttons = await page.$x(`//button[@id="didomi-notice-agree-button"]`);
  if (buttons.length > Constants.ZERO) {
    await buttons[0].click();
  }
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export default scrapingFeeds;
