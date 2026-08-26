import { OrderConfirmedEvent } from 'src/order/domain/events/order-confirmed.event';
import { OrderPlacedEvent } from 'src/order/domain/events/order-placed.event';

export const EventHandlers = [OrderPlacedEvent, OrderConfirmedEvent];
