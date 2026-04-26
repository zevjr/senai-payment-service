import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { NotificationService, TransactionPayload } from '../notification/notification.service';

@Injectable()
export class MessagingConsumer implements OnModuleInit {
  private readonly logger = new Logger(MessagingConsumer.name);

  constructor(private readonly notificationService: NotificationService) {}

  onModuleInit = async (): Promise<void> => {
    const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
    const connection = await amqplib.connect(url);
    const channel = await connection.createChannel();

    await channel.assertQueue('transaction.received', { durable: true });
    await channel.assertQueue('transaction.confirmed', { durable: true });

    this.logger.log('Consumidor RabbitMQ iniciado — aguardando mensagens...');

    channel.consume('transaction.received', (msg) => {
      if (!msg) return;

      const payload: TransactionPayload = JSON.parse(msg.content.toString());
      this.notificationService.notifyTransactionReceived(payload);
      channel.ack(msg);
    });

    channel.consume('transaction.confirmed', (msg) => {
      if (!msg) return;

      const payload: TransactionPayload = JSON.parse(msg.content.toString());
      this.notificationService.notifyTransactionConfirmed(payload);
      channel.ack(msg);
    });
  };
}
