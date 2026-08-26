import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderStatus } from '../value-objects/order-status.vo';
import { ShippingAddress } from '../value-objects/shipping-address.vo';
import { OrderItem } from './order-item.entity';

interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot {
  private readonly _id: OrderId;
  private readonly _customerId: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  private readonly _shippingAddress: ShippingAddress;
  private _trackingNumber: string | null;
  private _notes: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor({
    id,
    customerId,
    status,
    items,
    shippingAddress,
    trackingNumber,
    notes,
    createdAt,
    updatedAt,
  }: OrderProps) {
    super();
    this._id = id;
    this._customerId = customerId;
    this._status = status;
    this._items = items;
    this._shippingAddress = shippingAddress;
    this._trackingNumber = trackingNumber;
    this._notes = notes;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  static place(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
  ) {
    if (items.length === 0) {
      throw new DomainException('An order must contain at least one item');
    }

    const now = new Date();
    const id = new OrderId();

    const order = new Order({
      id,
      customerId,
      status: OrderStatus.pending(),
      items,
      shippingAddress,
      trackingNumber: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    });

    order.apply(new OrderPlacedEvent(id.getValue(), customerId));

    return order;
  }

  get id(): OrderId {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get items(): readonly OrderItem[] {
    return [...this._items];
  }

  get shippingAddress(): ShippingAddress {
    return this._shippingAddress;
  }

  get trackingNumber(): string | null {
    return this._trackingNumber;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  getTotal(): Money {
    return this.getSubtotal();
  }

  getSubtotal(): Money {
    if (this._items.length === 0) {
      return Money.zero();
    }

    return this._items.reduce(
      (sum, item) => sum.add(item.subtotal),
      Money.zero(this._items[0].unitPrice.getCurrency()),
    );
  }

  getItemCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
