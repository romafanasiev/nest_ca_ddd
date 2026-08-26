import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../ports/order.repository.port';
import { ShipOrderCommand } from './ship-order.command';

@CommandHandler(ShipOrderCommand)
export class ShipOrderHandler implements ICommandHandler<
  ShipOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ShipOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );

    if (!order) {
      throw new ApplicationException(
        `Order ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    const trackedOrder = this.eventPublisher.mergeObjectContext(order);

    trackedOrder.ship(command.trackingNumber);

    await this.orderRepository.save(trackedOrder);

    trackedOrder.commit();
  }
}
