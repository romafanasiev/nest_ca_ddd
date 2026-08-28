import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { PaymentId } from 'src/payment/domain/value-objects/payment-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepository,
} from '../../ports/payment.repository.port';
import { ConfirmPaymentCommand } from './confirm-payment.command';

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentHandler implements ICommandHandler<ConfirmPaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ConfirmPaymentCommand): Promise<void> {
    const payment = await this.paymentRepository.findById(
      new PaymentId(command.paymentId),
    );

    if (!payment) {
      throw new ApplicationException(
        `${command.paymentId} payment not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    if (payment.status.isSucceeded()) {
      return;
    }

    const tracked = this.eventPublisher.mergeObjectContext(payment);

    tracked.complete(command.gatewayTransactionId);

    await this.paymentRepository.save(tracked);

    tracked.commit();
  }
}
