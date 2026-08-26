import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from 'src/customer/application/ports/notification.port';
import { OrderConfirmedEvent } from 'src/order/domain/events/order-confirmed.event';

@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedHandler implements IEventHandler<OrderConfirmedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderConfirmedEvent) {
    await this.notificationService.sendNotification({
      recipientId: 'shipping@shop.com',
      subject: 'Order ready to ship',
      message: `Order ${event.orderId} has been paid`,
    });
  }
}
