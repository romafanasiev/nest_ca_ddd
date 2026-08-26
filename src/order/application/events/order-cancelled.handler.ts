import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from 'src/customer/application/ports/notification.port';
import { OrderCancelledEvent } from 'src/order/domain/events/order-cancelled.event';

@EventsHandler(OrderCancelledEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderCancelledEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderCancelledEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order has been cancelled',
      message: `Order ${event.orderId} has been cancelled`,
    });
  }
}
