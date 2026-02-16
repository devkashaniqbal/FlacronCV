import { Controller, Post, Req, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Request } from 'express';

@ApiTags('webhooks')
@Controller('webhooks')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() request: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    if (!request.rawBody) {
      this.logger.error('Raw body not available for webhook');
      return { received: false };
    }

    try {
      const event = this.paymentService.constructEvent(request.rawBody, signature);
      await this.paymentService.handleWebhookEvent(event);
      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook error: ${(error as Error).message}`);
      return { received: false, error: (error as Error).message };
    }
  }
}
