import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from 'src/customer/application/ports/customer.repository.port';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { CustomerPort } from 'src/order/application/ports/customer.port';

@Injectable()
export class CustomerAdapter implements CustomerPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async exists(customerId: string): Promise<boolean> {
    const customer = await this.customerRepository.findById(
      new CustomerId(customerId),
    );

    return customer !== null;
  }
}
