import { Payment } from 'src/payment/domain/entities/payment.entity';
import { PaymentId } from 'src/payment/domain/value-objects/payment-id.vo';
import { UniqueId } from 'src/shared/domain/value-objects/unique-id.vo';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByOrderId(orderId: UniqueId): Promise<Payment | null>;
  findById(id: PaymentId): Promise<Payment | null>;
}
