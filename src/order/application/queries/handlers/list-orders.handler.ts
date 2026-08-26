import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Order } from 'src/order/domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../ports/order.repository.port';
import { ListOrdersQuery } from '../list-orders.query';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<
  ListOrdersQuery,
  Order[]
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: ListOrdersQuery): Promise<Order[]> {
    if (query.customerId) {
      return this.orderRepository.findByCustomerId(query.customerId);
    }

    return this.orderRepository.findAll();
  }
}
