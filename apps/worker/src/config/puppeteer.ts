import puppeteer from 'puppeteer';

let browser: puppeteer.Browser;
let page: puppeteer.Page;

async function initPuppeteerInstance() {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  page = await browser.newPage({ type: 'tab' });
}

export { browser, page, initPuppeteerInstance };
