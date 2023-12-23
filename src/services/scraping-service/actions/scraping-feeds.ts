import puppeteer from 'puppeteer';
import { createFeed } from '../../../db/feeds';
import Constants from '../../../utils/constants';

const scrapingFeeds = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const URL = 'https://elpais.com';
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    let sleepDuration = randomIntFromInterval(1000, 2000);

    await page.goto(URL, { waitUntil: 'networkidle2' });

    new Promise((page) => setTimeout(page, sleepDuration));

    const feeds = await saveFeedsOfOneJournal(page);

    return feeds;
  } catch (error) {
    console.log(error);
  }
};

const saveFeedsOfOneJournal = async (page: any) => {
  let feeds = [];

  const buttons = await page.$x(`//button[@id="didomi-notice-agree-button"]`);
  if (buttons.length > Constants.ZERO) {
    await buttons[0].click();
  }

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

            try {
              await createFeed(feed);
              feeds.push(feed);
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    }
  }

  return feeds;
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export default scrapingFeeds;
