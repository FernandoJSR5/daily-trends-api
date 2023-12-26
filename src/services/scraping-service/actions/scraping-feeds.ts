import puppeteer from 'puppeteer';
import { createFeed } from '../../../db/feeds';
import Constants from '../../../utils/constants';

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

      await page.goto('https://elpais.com', { waitUntil: 'networkidle2' });

      new Promise((page) => setTimeout(page, randomIntFromInterval(1000, 2000)));

      const firstFeeds = await saveFeedsOfOnePage(page);

      const secondFeeds = await navegateToSecondPage(page, 'https://www.elmundo.es');

      const result = firstFeeds.concat(secondFeeds);

      return {
        result,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const main = async () => {
    await navigateOnePage();
  };

  main();
};

const navegateToSecondPage = async (page: any, URL: String) => {
  await page.goto(URL, { waitUntil: 'networkidle2' });
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
            let author;
            let title;
            let description;
            let link;

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
              console.log(author);
            }

            const descriptions = await page.$x(`${xpath}/p`);
            if (descriptions.length > Constants.ZERO) {
              description = (await page.evaluate(
                (el: any) => el.innerText,
                descriptions[0]
              )) as string;
              console.log(description);
            }

            const feed = {
              author: typeof author === 'undefined' ? '' : author,
              title,
              description: typeof description === 'undefined' ? '' : description,
              link,
              journal: Constants.EL_PAIS,
            };

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
          let author;
          let title;
          let description;
          let link;
          if (index1 === Constants.ONE) {
            let filteredAuthor;
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
                console.log(link);
              }

              const titles = await page.$x(`${articleXPath}/div/div/header/a/h2`);
              if (titles.length > Constants.ZERO) {
                title = (await page.evaluate(
                  (el: any) => el.innerText,
                  titles[0]
                )) as string;
                console.log(title);
              }

              const authors = await page.$x(`${articleXPath}/div/div/div/ul/li/span`);
              if (authors.length > Constants.ZERO) {
                author = (await page.evaluate(
                  (el: any) => el.innerText,
                  authors[0]
                )) as string;
                filteredAuthor = author.replace('REDACCIÓN:\n', '');
                console.log(filteredAuthor);
              }
            }

            const feed = {
              author: typeof filteredAuthor === 'undefined' ? '' : filteredAuthor,
              title,
              description: typeof description === 'undefined' ? '' : description,
              link,
              journal: Constants.EL_MUNDO,
            };

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
                    console.log(link);
                  }

                  const titles = await page.$x(`${articleXPath}/div/div/header/a/h2`);
                  if (titles.length > Constants.ZERO) {
                    title = (await page.evaluate(
                      (el: any) => el.innerText,
                      titles[0]
                    )) as string;
                    console.log(title);
                  }

                  const authors = await page.$x(
                    `${articleXPath}/div/div/div/ul/li/span/a`
                  );
                  if (authors.length > Constants.ZERO) {
                    author = (await page.evaluate(
                      (el: any) => el.innerText,
                      authors[0]
                    )) as string;
                    console.log(author);
                  }
                }

                const feed = {
                  author: typeof author === 'undefined' ? '' : author,
                  title,
                  description: typeof description === 'undefined' ? '' : description,
                  link,
                  journal: Constants.EL_MUNDO,
                };

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

const saveFeed = async (feed: any, feeds: any) => {
  try {
    feeds.push(feed);
    await createFeed(feed);
  } catch (error) {
    console.log(error);
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
