import 'dotenv/config';

import assert from 'assert';
import cors from 'cors';
import express from 'express';

import { connectRabbitMQ } from '@repo/utils/rabbitmq';
import conversionRouter from './routes/conversion.js';
import uploadRouter from './routes/upload.js';

const app = express();

app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());

// health checkpoint
app.get('/_health', (_, res) => {
	res.status(200).send('ok');
});

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/conversion', conversionRouter);

(async () => {
	assert.ok(process.env.HOST);
	assert.ok(process.env.PORT);

	await connectRabbitMQ();

	app.listen(+process.env.PORT, process.env.HOST, () =>
		console.log(`RabbitMQ connected, Server running on port: ${process.env.PORT}`),
	);
})();
