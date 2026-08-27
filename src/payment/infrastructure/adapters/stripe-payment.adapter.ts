import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CheckoutLineItem,
  CheckoutUrls,
  CreateCheckoutSessionResult,
  PaymentGatewayPort,
} from 'src/payment/ports/payment-gateway.port';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentAdapter implements PaymentGatewayPort {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');
  }

  async createCheckoutSession(
    line_items: CheckoutLineItem[],
    metadata: { orderId: string; paymentId: string },
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: line_items.map((lineItem) => ({
        quantity: lineItem.quantity,
        price_data: {
          currency: lineItem.unitAmount.getCurrency().toLowerCase(),
          unit_amount: lineItem.unitAmount.toCents(),
          product_data: { name: lineItem.name },
        },
      })),
      success_url: urls?.successUrl,
      cancel_url: urls?.cancelUrl,
      metadata: {
        orderId: metadata.orderId,
        paymentId: metadata.paymentId,
      },
    });

    return {
      url: session.url!,
      sessionId: session.id,
    };
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
