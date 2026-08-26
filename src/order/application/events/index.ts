import { OrderCancelledEvent } from 'src/order/domain/events/order-cancelled.event';
import { OrderConfirmedEvent } from 'src/order/domain/events/order-confirmed.event';
import { OrderDeliveredEvent } from 'src/order/domain/events/order-delivered.event';
import { OrderPlacedEvent } from 'src/order/domain/events/order-placed.event';
import { OrderShippedEvent } from 'src/order/domain/events/order-shipped.event';

export const EventHandlers = [
  OrderPlacedEvent,
  OrderConfirmedEvent,
  OrderShippedEvent,
  OrderDeliveredEvent,
  OrderCancelledEvent,
];
