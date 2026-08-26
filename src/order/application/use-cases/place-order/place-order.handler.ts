import { Inject } from '@nestjs/common';
import {
  CommandHandler,
  EventPublisher,
  type ICommandHandler,
} from '@nestjs/cqrs';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from 'src/order/application/ports/order.repository.port';
import { OrderItem } from 'src/order/domain/entities/order-item.entity';
import { Order } from 'src/order/domain/entities/order.entity';
import { ProductId } from 'src/order/domain/value-objects/product-id.vo';
import { ShippingAddress } from 'src/order/domain/value-objects/shipping-address.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { CUSTOMER, type CustomerPort } from '../../ports/customer.port';
import { PRODUCT, type ProductPort } from '../../ports/product.port';
import { PlaceOrderCommand } from './place-order.command';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(CUSTOMER)
    private readonly customer: CustomerPort,
    @Inject(PRODUCT)
    private readonly product: ProductPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<void> {
    const customerExists = await this.customer.exists(command.customerId);

    if (!customerExists) {
      throw new ApplicationException(
        `Customer with id ${command.customerId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    for (const item of command.items) {
      const productExists = await this.product.exists(item.productId);

      if (!productExists) {
        throw new ApplicationException(
          `Product with id ${item.productId} not found`,
          ApplicationExceptionCode.NOT_FOUND,
        );
      }
    }

    const items = command.items.map((item) =>
      OrderItem.create({
        productId: new ProductId(item.productId),
        productName: item.productName,
        unitPrice: Money.create(item.unitPrice, item.currency),
        quantity: item.quantity,
        discount:
          item.discount !== undefined
            ? Money.create(item.discount, item.currency)
            : undefined,
      }),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      zipCode: command.shippingZipCode,
      country: command.shippingCounty,
    });

    const order = this.eventPublisher.mergeObjectContext(
      Order.place(command.customerId, items, shippingAddress),
    );

    await this.orderRepository.save(order);

    order.commit();
  }
}
