import { Module } from '@nestjs/common';
import { CommandHandlers } from './application';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repo';
import { ProductsController } from './presentation/product.controller';
@Module({
  controllers: [ProductsController],
  providers: [
    ...CommandHandlers,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
