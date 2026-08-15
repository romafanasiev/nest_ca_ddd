import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import { Email } from 'src/customer/domain/value-objects/email.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../ports/customer.repository.port';
import { GetCustomerByEmailQuery } from '../get-customer-by-email.query';

@QueryHandler(GetCustomerByEmailQuery)
export class GetCustomerByEmailHandler implements IQueryHandler<
  GetCustomerByEmailQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerByEmailQuery) {
    const email = Email.create(query.email);

    const customer = await this.customerRepository.findByEmail(email);

    if (!customer) {
      throw new ApplicationException(
        `Customer with email ${email.getValue()} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
