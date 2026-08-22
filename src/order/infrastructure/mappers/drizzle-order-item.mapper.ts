import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import { OrderItemId } from 'src/order/domain/value-objects/order-item-id.vo';
import { ProductId } from 'src/order/domain/value-objects/product-id.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { orderItems } from 'src/shared/infrastructure/database/postgres/schema';

export type OrderItemRow = typeof orderItems.$inferSelect;
export type OrderItemInsert = typeof orderItems.$inferInsert;

export class DrizzleOrderItemMapper {
  static toPersistence(item: OrderItem, orderId: string): OrderItemInsert {
    return {
      id: item.getId().getValue(),
      orderId,
      productId: item.productId.getValue(),
      productName: item.productName,
      unitPriceAmount: item.unitPrice.toCents(),
      unitPriceCurrency: item.unitPrice.getCurrency(),
      quantity: item.quantity,
      discountAmount: item.discount ? item.discount.toCents() : null,
      discountCurrency: item.discount ? item.discount.getCurrency() : null,
    };
  }

  static toDomain(row: OrderItemRow): OrderItem {
    return OrderItem.reconstitute({
      id: new OrderItemId(row.id),
      productId: new ProductId(row.productId),
      productName: row.productName,
      unitPrice: Money.fromCents(row.unitPriceAmount, row.unitPriceCurrency),
      discount:
        row.discountAmount !== null
          ? Money.fromCents(row.discountAmount, row.discountCurrency ?? 'USD')
          : null,
      quantity: row.quantity,
    });
  }
}
