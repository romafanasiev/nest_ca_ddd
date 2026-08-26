import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/customer/customer.module';
import { ProductModule } from 'src/product/product.module';
import { CommandHandlers } from './application';
import { EventHandlers } from './application/events';
import { CUSTOMER } from './application/ports/customer.port';
import { ORDER_REPOSITORY } from './application/ports/order.repository.port';
import { PRODUCT } from './application/ports/product.port';
import { CustomerAdapter } from './infrastructure/adapters/customer.adapter';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository';
import { ProductAdapter } from './infrastructure/adapters/product.adapter';
import { OrderController } from './presentation/order.controller';

@Module({
  imports: [CustomerModule, ProductModule],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    { provide: ORDER_REPOSITORY, useClass: DrizzleOrderRepository },
    { provide: CUSTOMER, useClass: CustomerAdapter },
    { provide: PRODUCT, useClass: ProductAdapter },
  ],
})
export class OrderModule {}
