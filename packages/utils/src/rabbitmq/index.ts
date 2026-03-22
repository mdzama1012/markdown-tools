import assert from 'assert';
import { amqpChannel, amqpConnection } from './config';

import type { ConsumeMessage } from 'amqplib';

export * from './config.js';

export function publishMessage(content: Buffer) {
	assert.ok(amqpChannel);
	assert.ok(amqpConnection);

	const keepSending = amqpChannel.publish('amq.direct', 'pdf', content);

	!keepSending && amqpChannel.once('drain', () => publishMessage(content));
}

export async function registerConsumer(
	queue: string,
	onMessage: (msg: ConsumeMessage | null) => void,
) {
	assert.ok(amqpChannel);
	assert.ok(amqpConnection);

	await amqpChannel.consume(queue, onMessage, {
		noAck: true,
		consumerTag: 'pdf-processor',
	});
}
