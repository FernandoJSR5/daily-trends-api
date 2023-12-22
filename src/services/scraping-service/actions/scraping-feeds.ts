import puppeteer from 'puppeteer';
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

    await page.goto(URL, { waitUntil: 'networkidle2' });

    let sleepDuration = randomIntFromInterval(1000, 2000);

    new Promise((page) => setTimeout(page, sleepDuration));

    await clickPolicy(page);

    const sections = await page.$x(`//main[@class="mw mw-mc"]/div[1]/section/div`);

    if (sections.length > Constants.ZERO) {
      sections.forEach(async (_, index1) => {
        const articles = await page.$x(
          `//main[@class="mw mw-mc"]/div[1]/section/div[${index1 + 1}]/ ${
            index1 === Constants.TWO ? 'div/' : ''
          }  article`
        );
        if (articles.length > Constants.ZERO) {
          if (articles.length > Constants.ZERO) {
            articles.forEach(async (_, index2) => {
              const header = await page.$x(
                `//main[@class="mw mw-mc"]/div[1]/section/div[${index1 + 1}]/  ${
                  index1 === Constants.TWO ? 'div/' : ''
                }  article[${index2 + 1}]/header/h2`
              );
              if (header.length > Constants.ZERO) {
                const text = (await page.evaluate(
                  (el: any) => el.innerText,
                  header[0]
                )) as string;
                console.log(text);
              }
            });
          }
        }
      });
    }

    return;
  } catch (error) {
    console.log(error);
  }
};

let clickPolicy = async (page: any) => {
  const buttons = await page.$x(`//button[@id="didomi-notice-agree-button"]`);
  if (buttons.length > Constants.ZERO) {
    await buttons[0].click();
  }
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export default scrapingFeeds;
