import 'dotenv/config';

import assert from 'assert';
import { marked } from 'marked';
import { sanitizeHtml } from '../utils/constants.js';
import { browser, page } from '../config/puppeteer.js';

import type { Job } from '../utils/types.js';
import { getObjectAccessUrl, streamUploadToS3 } from '@repo/aws';

async function pdfProcessing(job: Job) {
  assert.ok(browser, 'Puppeteer browser not instantiated');
  assert.ok(page, 'Browser page is not instantiated');

  // get markdown content
  const url = await getObjectAccessUrl(job.markdownFilekey);
  const res = await fetch(url, { method: 'GET' });
  const markdownContent = await res.text();

  // generate html
  const html = await marked.parse(markdownContent);
  const sanitizedHtml = sanitizeHtml(html, 'Generated PDF file');

  // generate pdf from the html
  await page.setContent(sanitizedHtml);
  await page.waitForNetworkIdle();
  await page.waitForSelector('img', { visible: true });

  // upload pdf to s3
  const pdfStream = await page.createPDFStream({
    format: 'A4',
    printBackground: true,
    tagged: true,
    margin: { top: '1.5cm', left: '1.25cm', bottom: '1.5cm', right: '1.25cm' },
  });

  const filekey = await streamUploadToS3(pdfStream);

  // update status of job after successful completion
  await fetch(`${process.env.API_BASE_URL}/api/v1/conversion/status/${job.jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'COMPLETED',
      filekey: filekey,
    }),
  });
}

export { pdfProcessing };
