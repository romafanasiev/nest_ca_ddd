import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { orders } from './orders.schema';

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'succeeded',
]);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  gatewayTransactionId: varchar('gateway_transaction_id'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('created_at').notNull().defaultNow(),
});
