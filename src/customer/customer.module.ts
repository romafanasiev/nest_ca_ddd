import { Module } from '@nestjs/common';
import { CommandHandlers } from './application';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port';
import { QueryHandlers } from './application/queries/handlers';
import { EventHandlers } from './domain/events';
import { ConsoleNotificationAdapter } from './infrastructure/adapters/console-notification.adapter';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { CustomersController } from './presentation/customer.controller';

@Module({
  controllers: [CustomersController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    { provide: NOTIFICATION_SERVICE, useClass: ConsoleNotificationAdapter },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomerModule {}
