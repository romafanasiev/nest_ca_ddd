import { OrderDeliveredHandler } from './events/order-delivered.handler';
import { OrderShippedHandler } from './events/order-shipped.handler';
import { CancelOrderHandler } from './use-cases/cancel-order/cancel-order.handler';
import { ConfirmOrderHandler } from './use-cases/confirm-order/confirm-order.handler';
import { PlaceOrderHandler } from './use-cases/place-order/place-order.handler';

export const CommandHandlers = [
  PlaceOrderHandler,
  ConfirmOrderHandler,
  OrderShippedHandler,
  OrderDeliveredHandler,
  CancelOrderHandler,
];
