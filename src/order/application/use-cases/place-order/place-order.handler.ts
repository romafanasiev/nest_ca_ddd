import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import { Order } from 'src/order/domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from 'src/order/domain/ports/order.repository.port';
import { ProductId } from 'src/order/domain/value-objects/product-id.vo';
import { ShippingAddress } from 'src/order/domain/value-objects/shipping-address.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { PlaceOrderCommand } from './place-order.command';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<void> {
    const items = command.items.map((item) =>
      OrderItem.create({
        productId: new ProductId(item.productId),
        productName: item.productName,
        unitPrice: Money.create(item.unitPrice, item.currency),
        quantity: item.quantity,
      }),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      zipCode: command.shippingZipCode,
      country: command.shippingCounty,
    });

    const order = Order.place(command.customerId, items, shippingAddress);

    await this.orderRepository.save(order);
  }
}
