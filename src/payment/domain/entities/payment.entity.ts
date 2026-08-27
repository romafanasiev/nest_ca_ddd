import { AggregateRoot } from '@nestjs/cqrs';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { PaymentId } from '../value-objects/payment-id.vo';
import { PaymentStatus } from '../value-objects/payment-status.vo';

export interface PaymentProps {
  id: PaymentId;
  orderId: string;
  amount: Money;
  status: PaymentStatus;
  gatewayTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot {
  private _id: PaymentId;
  private _orderId: string;
  private _amount: Money;
  private _status: PaymentStatus;
  private _gatewayTransactionId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor({
    id,
    orderId,
    amount,
    status,
    gatewayTransactionId,
    createdAt,
    updatedAt,
  }: PaymentProps) {
    super();
    this._id = id;
    this._orderId = orderId;
    this._amount = amount;
    this._status = status;
    this._gatewayTransactionId = gatewayTransactionId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static initiate(orderId: string, amount: Money): Payment {
    if (amount.getAmount() <= 0) {
      throw new DomainException('Payment amount must be greater than 0');
    }

    const now = new Date();

    return new Payment({
      id: new PaymentId(),
      orderId,
      amount,
      status: PaymentStatus.pending(),
      gatewayTransactionId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  get id(): PaymentId {
    return this._id;
  }

  get amount(): Money {
    return this._amount;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get orderId(): string {
    return this._orderId;
  }

  get gatewayTransactionId(): string | null {
    return this._gatewayTransactionId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isSucceeded(): boolean {
    return this.status.isSucceeded();
  }

  startCheckout() {
    if (this.isSucceeded()) {
      throw new DomainException(
        `Cannot start checkout for a payment in ${this._status.getValue()} status`,
      );
    }

    this._status = PaymentStatus.processing();
    this._updatedAt = new Date();
  }
}
