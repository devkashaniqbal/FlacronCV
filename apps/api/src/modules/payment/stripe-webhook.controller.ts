import { Controller, Post, Req, Headers, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
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
      throw new BadRequestException('Missing raw body');
    }

    let event: ReturnType<PaymentService['constructEvent']>;
    try {
      event = this.paymentService.constructEvent(request.rawBody, signature);
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${(error as Error).message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    try {
      await this.paymentService.handleWebhookEvent(event);
      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook processing error: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Webhook processing failed');
    }
  }
}
