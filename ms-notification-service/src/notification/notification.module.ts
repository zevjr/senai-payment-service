import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagingConsumer } from '../messaging/messaging.consumer';

@Module({
  providers: [NotificationService, MessagingConsumer],
})
export class NotificationModule {}
