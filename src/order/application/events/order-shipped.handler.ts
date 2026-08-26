import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from 'src/customer/application/ports/notification.port';
import { OrderShippedEvent } from 'src/order/domain/events/order-shipped.event';

@EventsHandler(OrderShippedEvent)
export class OrderShippedHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order shipped',
      message: `Order ${event.orderId} has been shipped`,
    });
  }
}
