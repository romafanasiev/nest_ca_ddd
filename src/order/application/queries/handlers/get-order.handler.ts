import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Order } from 'src/order/domain/entities/order.entity';
import { OrderId } from 'src/order/domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../ports/order.repository.port';
import { GetOrderQuery } from '../get-order.query';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order> {
    const order = await this.orderRepository.findById(new OrderId(query.id));

    if (!order) {
      throw new ApplicationException(
        `Order with id ${query.id} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return order;
  }
}
