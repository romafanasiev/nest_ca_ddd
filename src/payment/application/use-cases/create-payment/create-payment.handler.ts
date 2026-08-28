import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Payment } from 'src/payment/domain/entities/payment.entity';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from 'src/payment/ports/payment-gateway.port';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import { UniqueId } from 'src/shared/domain/value-objects/unique-id.vo';
import {
  ORDER_PRICING,
  type OrderPricingPort,
} from '../ports/order-pricing.port';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from '../ports/payment.repository.port';
import { CreatePaymentCommand } from './create-payment.command';

interface CreatePaymentResponse {
  checkoutUrl: string;
  paymentId: string;
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<
  CreatePaymentCommand,
  CreatePaymentResponse
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(ORDER_PRICING)
    private readonly orderPricing: OrderPricingPort,
    private readonly eventPublisher: EventPublisher,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
    const orderId = new UniqueId(command.orderId);
    const existing = await this.paymentRepository.findByOrderId(orderId);

    if (existing?.isSucceeded()) {
      throw new ApplicationException(
        `Order with ID ${orderId.getValue()} already succeeded`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const pricing = await this.orderPricing.getOrderPricing(orderId.getValue());

    if (!pricing) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
      );
    }

    let payment: Payment;

    if (existing) {
      payment = this.eventPublisher.mergeObjectContext(existing);
    } else {
      payment = this.eventPublisher.mergeObjectContext(
        Payment.initiate(orderId.toString(), pricing.total),
      );
    }

    const { url } = await this.paymentGateway.createCheckoutSession(
      pricing.lines,
      { orderId: command.orderId, paymentId: payment.id.getValue() },
      { successUrl: command.successUrl, cancelUrl: command.cancelUrl },
    );

    payment.startCheckout();

    await this.paymentRepository.save(payment);

    payment.commit();

    return { paymentId: payment.id.getValue(), checkoutUrl: url };
  }
}
