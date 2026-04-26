import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { AppController } from './app.controller';

@Module({
  imports: [PaymentModule],
  controllers: [AppController],
})
export class AppModule {}
