import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    CqrsModule.forRoot(),
    MongoModule,
    DrizzleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
