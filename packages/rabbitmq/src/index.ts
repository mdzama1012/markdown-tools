import 'dotenv/config';

import assert from 'assert';
import amqplib from 'amqplib';
import type { ConsumeMessage } from 'amqplib';
import type { ChannelModel, Channel } from 'amqplib';

export let amqpConnection: ChannelModel;
export let amqpChannel: Channel;

export async function connectRabbitMQ() {
  assert.ok(process.env.CLOUDAMQP_URL);

  amqpConnection = await amqplib.connect(process.env.CLOUDAMQP_URL);
  amqpChannel = await amqpConnection.createChannel();

  // queue hold PDF conversion request.
  await amqpChannel.assertQueue('pdf-processing', { durable: true });
  await amqpChannel.bindQueue('pdf-processing', 'amq.direct', 'pdf');
}

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
