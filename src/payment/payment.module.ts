import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { ORDER_PRICING } from './application/ports/order-pricing.port';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.port';
import { CommandHandlers } from './application/use-cases';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository';
import { OrderPricingAdapter } from './infrastructure/adapters/order-pricing.adapter';
import { StripePaymentAdapter } from './infrastructure/adapters/stripe-payment.adapter';
import { PAYMENT_GATEWAY } from './ports/payment-gateway.port';
import { PaymentController } from './presentation/payment.controller';

@Module({
  imports: [OrderModule],
  controllers: [PaymentController],
  providers: [
    ...CommandHandlers,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
    { provide: ORDER_PRICING, useClass: OrderPricingAdapter },
  ],
})
export class PaymentModule {}
