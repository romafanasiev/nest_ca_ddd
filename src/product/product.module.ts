import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandlers } from './application';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { QueryHandlers } from './application/queries/handlers';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repo';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repo';
import { ProductsController } from './presentation/product.controller';
@Module({
  controllers: [ProductsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoProductRepository,
        drizzleRepo: DrizzleProductRepository,
      ) => {
        return configService.get('DATABASE') === 'postgresql'
          ? drizzleRepo
          : mongoRepo;
      },
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
