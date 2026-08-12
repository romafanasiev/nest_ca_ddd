import { Global, Module } from '@nestjs/common';
import { MongoConnection } from './mongo.connection';
import { MongoProvider } from './mongo.provider';

@Global()
@Module({
  providers: [MongoConnection, MongoProvider],
  exports: [MongoProvider],
})
export class MongoModule {}
