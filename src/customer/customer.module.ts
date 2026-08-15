import { Module } from '@nestjs/common';
import { CommandHandlers } from './application';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { CustomersController } from './presentation/customer.controller';

@Module({
  controllers: [CustomersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
