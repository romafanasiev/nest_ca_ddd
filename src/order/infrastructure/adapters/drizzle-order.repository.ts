import { Inject, Injectable } from '@nestjs/common';
import { and, eq, notInArray, sql, type SQL } from 'drizzle-orm';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderRepositoryPort } from 'src/order/domain/ports/order.repository.port';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { DrizzleOrderItemMapper } from 'src/order/infrastructure/mappers/drizzle-order-item.mapper';
import { DrizzleOrderMapper } from 'src/order/infrastructure/mappers/drizzle-order.mapper';
import {
  DRIZZLE,
  type DrizzleDB,
} from 'src/shared/infrastructure/database/postgres/drizzle.provider';
import {
  orderItems,
  orders,
} from 'src/shared/infrastructure/database/postgres/schema';

@Injectable()
export class DrizzleOrderRepository implements OrderRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(order: Order): Promise<void> {
    const orderId = order.id.getValue();
    const orderRow = DrizzleOrderMapper.toPersistence(order);
    const itemRows = order.items.map((item) =>
      DrizzleOrderItemMapper.toPersistence(item, orderId),
    );
    const keptItemIds = itemRows.map((itemRow) => itemRow.id);

    const { id, createdAt, ...updatableOrder } = orderRow;

    await this.db.transaction(async (tx) => {
      await tx
        .insert(orders)
        .values(orderRow)
        .onConflictDoUpdate({ target: orders.id, set: updatableOrder });

      await tx
        .delete(orderItems)
        .where(
          keptItemIds.length > 0
            ? and(
                eq(orderItems.orderId, orderId),
                notInArray(orderItems.id, keptItemIds),
              )
            : eq(orderItems.orderId, orderId),
        );

      if (itemRows.length === 0) return;

      await tx
        .insert(orderItems)
        .values(itemRows)
        .onConflictDoUpdate({
          target: orderItems.id,
          set: {
            orderId: sql`excluded.order_id`,
            productId: sql`excluded.product_id`,
            productName: sql`excluded.product_name`,
            unitPriceAmount: sql`excluded.unit_price_amount`,
            unitPriceCurrency: sql`excluded.unit_price_currency`,
            quantity: sql`excluded.quantity`,
            discountAmount: sql`excluded.discount_amount`,
            discountCurrency: sql`excluded.discount_currency`,
          },
        });
    });
  }

  async findById(id: OrderId): Promise<Order | null> {
    const found = await this.findMany(eq(orders.id, id.getValue()));

    return found[0] ?? null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.findMany(eq(orders.customerId, customerId));
  }

  async findAll(): Promise<Order[]> {
    return this.findMany();
  }

  async delete(id: OrderId): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id.getValue()));
      await tx.delete(orders).where(eq(orders.id, id.getValue()));
    });
  }

  private async findMany(where?: SQL): Promise<Order[]> {
    const rows = await this.db.query.orders.findMany({
      where,
      with: {
        items: {
          orderBy: (item, { asc }) => [asc(item.id)],
        },
      },
      orderBy: (order, { asc }) => [asc(order.createdAt), asc(order.id)],
    });

    return rows.map((row) => DrizzleOrderMapper.toDomain(row, row.items));
  }
}
