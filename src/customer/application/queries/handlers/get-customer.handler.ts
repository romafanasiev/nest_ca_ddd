import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../ports/customer.repository.port';
import { GetCustomerQuery } from '../get-customer.query';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerQuery) {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.id),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with ID ${query.id} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
