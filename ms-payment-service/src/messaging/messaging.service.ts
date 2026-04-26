import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessagingService.name);
  private connection: amqplib.ChannelModel;
  private channel: amqplib.Channel;

  private readonly queues = ['transaction.received', 'transaction.confirmed'];

  onModuleInit = async (): Promise<void> => {
    const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
    this.connection = await amqplib.connect(url);
    this.channel = await this.connection.createChannel();

    for (const queue of this.queues) {
      await this.channel.assertQueue(queue, { durable: true });
    }

    this.logger.log('Conexão com RabbitMQ estabelecida');
  };

  onModuleDestroy = async (): Promise<void> => {
    await this.channel.close();
    await this.connection.close();
  };

  publish = async (queue: string, payload: Record<string, unknown>): Promise<void> => {
    const content = Buffer.from(JSON.stringify(payload));
    this.channel.sendToQueue(queue, content, { persistent: true });
    this.logger.log(`Mensagem publicada na fila [${queue}]: ${JSON.stringify(payload)}`);
  };
}
