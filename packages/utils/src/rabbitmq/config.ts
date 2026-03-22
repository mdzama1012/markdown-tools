import 'dotenv/config';

import assert from 'assert';
import amqplib from 'amqplib';

import type { Channel, ChannelModel } from 'amqplib';

let amqpConnection: ChannelModel;
let amqpChannel: Channel;

async function connectRabbitMQ() {
	assert.ok(process.env.CLOUDAMQP_URL);

	amqpConnection = await amqplib.connect(process.env.CLOUDAMQP_URL);
	amqpChannel = await amqpConnection.createChannel();

	// queue hold PDF conversion request.
	await amqpChannel.assertQueue('pdf-processing', { durable: true });
	await amqpChannel.bindQueue('pdf-processing', 'amq.direct', 'pdf');
}

export { amqpChannel, amqpConnection, connectRabbitMQ };
