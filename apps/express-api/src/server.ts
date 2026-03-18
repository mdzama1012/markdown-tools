import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import assert from 'assert';

import uploadRouter from './routes/upload.js';
import conversionRouter from './routes/conversion.js';
import { connectRabbitMQ } from '@repo/rabbitmq';

const app = express();

app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/conversion', conversionRouter);

(async () => {
  assert.ok(process.env.HOST);
  assert.ok(process.env.PORT);

  await connectRabbitMQ();

  app.listen(+process.env.PORT, process.env.HOST, () =>
    console.log(`RabbitMQ connected, Server running on port: ${process.env.PORT}`)
  );
})();
