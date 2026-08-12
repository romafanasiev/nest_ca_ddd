import type { FactoryProvider } from '@nestjs/common';
import type { Db } from 'mongodb';
import { MongoConnection } from './mongo.connection';

export const MONGO_DB = Symbol('MONGO_DB');

export const MongoProvider: FactoryProvider<Promise<Db>> = {
  provide: MONGO_DB,
  inject: [MongoConnection],
  useFactory: (connection: MongoConnection) => connection.connect(),
};
