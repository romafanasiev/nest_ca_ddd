import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../ports/customer.repository.port';
import { ListCustomersQuery } from '../list-customers.query';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<
  ListCustomersQuery,
  Customer[]
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute() {
    return this.customerRepository.findAll();
  }
}
