import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export enum PaymentStatusValue {
  Pending = 'pending',
  Processing = 'processing',
  Succeeded = 'succeeded',
}

export class PaymentStatus {
  private readonly value: PaymentStatusValue;

  private constructor(value: PaymentStatusValue) {
    this.value = value;
  }

  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Pending);
  }

  static processing(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Processing);
  }

  static succeeded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Succeeded);
  }

  static fromString(value: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const status = Object.values(PaymentStatusValue).find((s) => s === value);

    if (!status) {
      throw new DomainException(`Invalid payment status`);
    }

    return new PaymentStatus(status);
  }

  getValue() {
    return this.value;
  }

  isSucceeded(): boolean {
    return this.getValue() === PaymentStatusValue.Succeeded;
  }

  isProcessing(): boolean {
    return this.value === PaymentStatusValue.Processing;
  }

  transitionToSucceeded(): PaymentStatus {
    if (!this.isProcessing()) {
      throw new DomainException('Cannot transition to succeeded ');
    }

    return PaymentStatus.succeeded();
  }
}
