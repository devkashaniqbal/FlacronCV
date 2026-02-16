import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { PaymentService } from './payment.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PaymentController, StripeWebhookController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
