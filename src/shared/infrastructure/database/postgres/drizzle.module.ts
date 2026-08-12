import { Global, Module } from '@nestjs/common';
import { DrizzleConnection } from './drizzle.connection';
import { DrizzleProvider } from './drizzle.provider';

@Global()
@Module({
  providers: [DrizzleConnection, DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}
