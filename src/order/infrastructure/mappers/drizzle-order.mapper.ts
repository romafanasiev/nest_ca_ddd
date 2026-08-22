import { Order } from 'src/order/domain/entities/order.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';
import { ShippingAddress } from 'src/order/domain/value-objects/shipping-address.vo';
import {
  DrizzleOrderItemMapper,
  type OrderItemRow,
} from 'src/order/infrastructure/mappers/drizzle-order-item.mapper';
import { orders } from 'src/shared/infrastructure/database/postgres/schema';

export type OrderRow = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;

export class DrizzleOrderMapper {
  static toPersistence(order: Order): OrderInsert {
    const total = order.getTotal();

    return {
      id: order.id.getValue(),
      customerId: order.customerId,
      status: order.status.getValue(),
      totalAmount: total.toCents(),
      totalCurrency: total.getCurrency(),
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingZipCode: order.shippingAddress.zipCode,
      shippingCountry: order.shippingAddress.country,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toDomain(row: OrderRow, itemRows: OrderItemRow[]): Order {
    return Order.reconstitute({
      id: new OrderId(row.id),
      customerId: row.customerId,
      status: OrderStatus.fromString(row.status),
      items: itemRows.map((itemRow) =>
        DrizzleOrderItemMapper.toDomain(itemRow),
      ),
      shippingAddress: ShippingAddress.create({
        street: row.shippingStreet ?? '',
        city: row.shippingCity ?? '',
        state: row.shippingState ?? '',
        zipCode: row.shippingZipCode ?? '',
        country: row.shippingCountry ?? '',
      }),
      trackingNumber: row.trackingNumber,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
