import {
  Body,
  Controller,
  Headers,
  Inject,
  Post,
  RawBody,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmPaymentCommand } from '../application/use-cases/confirm-payment/confirm-payment.command';
import { CreatePaymentCommand } from '../application/use-cases/create-payment/create-payment.command';
import { StripePaymentAdapter } from '../infrastructure/adapters/stripe-payment.adapter';
import { PAYMENT_GATEWAY } from '../ports/payment-gateway.port';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: StripePaymentAdapter,
  ) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.commandBus.execute<
      CreatePaymentCommand,
      { orderId: string; checkoutUrl: string }
    >(new CreatePaymentCommand(dto.orderId, dto.successUrl, dto.cancelUrl));
  }

  @Post('webhook')
  async handleWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.paymentGateway.constructWebhookEvent(payload, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const paymentId = session.metadata?.paymentId;
        const gatewayTransactionId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        if (gatewayTransactionId && paymentId) {
          await this.commandBus.execute(
            new ConfirmPaymentCommand(paymentId, gatewayTransactionId),
          );
        }

        break;
      }
      default:
        break;
    }
  }
}
