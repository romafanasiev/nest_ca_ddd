import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../ports/customer.repository.port';
import { DeleteCustomerCommand } from './delete-customer.command';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<
  DeleteCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(command: DeleteCustomerCommand) {
    const customer = await this.customerRepository.findById(
      new CustomerId(command.id),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${command.id} not exist`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.customerRepository.deleteCustomer(customer.getId());
  }
}
