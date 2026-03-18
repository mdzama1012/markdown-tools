import { connectRabbitMQ, registerConsumer } from '@repo/rabbitmq';
import { initPuppeteerInstance } from './config/puppeteer.js';
import { pdfProcessing } from './handlers/pdf-processing.js';
import assert from 'assert';

async function startConsumer() {
  // connect to rabbitMQ server.
  await connectRabbitMQ();

  // initialize puppeteer instance.
  await initPuppeteerInstance();

  // register a consumer on queue.
  await registerConsumer('pdf-processing', (message) => {
    assert.ok(message, "Message can't be NULL");

    const job = JSON.parse(message.content.toString('utf-8'));
    pdfProcessing(job);
  });

  console.log('Consumer service running...');
}

startConsumer();
