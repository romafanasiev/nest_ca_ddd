import { Entity } from 'src/shared/domain/entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { OrderItemId } from '../value-objects/order-item-id.vo';
import { ProductId } from '../value-objects/product-id.vo';

export interface OrderItemProps {
  id: OrderItemId;
  productId: ProductId;
  productName: string;
  unitPrice: Money;
  quantity: number;
  discount: Money | null;
}

export class OrderItem extends Entity<OrderItemId> {
  private readonly _productId: ProductId;
  private readonly _productName: string;
  private readonly _unitPrice: Money;
  private _quantity: number;
  private _discount: Money | null;

  private constructor({
    id,
    productId,
    productName,
    unitPrice,
    quantity,
    discount,
  }: OrderItemProps) {
    super(id);
    this._productId = productId;
    this._productName = productName;
    this._unitPrice = unitPrice;
    this._quantity = quantity;
    this._discount = discount;
  }

  static create({
    productId,
    productName,
    unitPrice,
    quantity,
    discount,
  }: {
    productId: ProductId;
    productName: string;
    unitPrice: Money;
    quantity: number;
    discount?: Money;
  }): OrderItem {
    OrderItem.assertProductName(productName);
    OrderItem.assertQuantity(quantity);

    const item = new OrderItem({
      id: new OrderItemId(),
      productId,
      productName: productName.trim(),
      unitPrice,
      quantity,
      discount: null,
    });

    if (discount) {
      item.applyDiscount(discount);
    }

    return item;
  }

  static reconstitute(props: OrderItemProps): OrderItem {
    OrderItem.assertDiscountCurrency(props.unitPrice, props.discount);

    return new OrderItem(props);
  }

  get productId(): ProductId {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  get quantity(): number {
    return this._quantity;
  }

  get discount(): Money | null {
    return this._discount;
  }

  get subtotal(): Money {
    if (this._discount) {
      return this.lineTotal.subtract(this._discount);
    }

    return this.lineTotal;
  }

  updateQuantity(quantity: number): void {
    OrderItem.assertQuantity(quantity);

    this._quantity = quantity;
    this._discount = null;
  }

  applyDiscount(discount: Money): void {
    OrderItem.assertDiscountCurrency(this._unitPrice, discount);

    if (discount.isGreaterThan(this.lineTotal)) {
      throw new DomainException('Discount cannot be greater than subtotal');
    }

    this._discount = discount;
  }

  removeDiscount(): void {
    this._discount = null;
  }

  private get lineTotal(): Money {
    return this._unitPrice.multiply(this._quantity);
  }

  private static assertProductName(productName: string): void {
    if (!productName || productName.trim().length === 0) {
      throw new DomainException('Order item product name is required');
    }
  }

  private static assertQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new DomainException(
        'Order item quantity must be a positive integer',
      );
    }
  }

  private static assertDiscountCurrency(
    unitPrice: Money,
    discount: Money | null,
  ): void {
    if (discount && discount.getCurrency() !== unitPrice.getCurrency()) {
      throw new DomainException(
        'Order item discount currency must match unit price currency',
      );
    }
  }

  getEffectiveUnitPrice(): Money {
    const subtotal = this.subtotal;

    return Money.fromCents(
      Math.round(subtotal.getAmount() / this.quantity),
      subtotal.getCurrency(),
    );
  }
}
