import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
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
import { RegisterCustomerCommand } from './register-customer.command';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<
  RegisterCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterCustomerCommand) {
    const email = Email.create(command.email);

    const existingByEmail = await this.customerRepository.findByEmail(email);

    if (existingByEmail) {
      throw new ApplicationException(
        `Customer with email ${email.getValue()} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const customer = this.eventPublisher.mergeObjectContext(
      Customer.register({
        email,
        firstName: command.firstName,
        lastName: command.lastName,
        phone: command.phone,
      }),
    );

    await this.customerRepository.save(customer);

    customer.commit();
  }
}
