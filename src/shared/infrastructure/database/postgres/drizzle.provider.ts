import type { FactoryProvider } from '@nestjs/common';
import { DrizzleConnection, type DrizzleDB } from './drizzle.connection';

export type { DrizzleDB };

export const DRIZZLE = Symbol('DRIZZLE');

export const DrizzleProvider: FactoryProvider<DrizzleDB> = {
  provide: DRIZZLE,
  inject: [DrizzleConnection],
  useFactory: (connection: DrizzleConnection) => connection.connect(),
};
