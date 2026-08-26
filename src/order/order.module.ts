import { Module } from '@nestjs/common';
import { CommandHandlers } from './application';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository';
import { OrderController } from './presentation/order.controller';

@Module({
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    { provide: ORDER_REPOSITORY, useClass: DrizzleOrderRepository },
  ],
})
export class OrderModule {}
