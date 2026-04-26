import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { MessagingModule } from '../messaging/messaging.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [MessagingModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, PrismaService],
})
export class PaymentModule {}
