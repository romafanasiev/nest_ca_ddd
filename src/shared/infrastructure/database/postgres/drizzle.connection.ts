import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

export type DrizzleDB = PostgresJsDatabase;

@Injectable()
export class DrizzleConnection implements OnApplicationShutdown {
  private readonly logger = new Logger(DrizzleConnection.name);
  private client: Sql | null = null;

  constructor(private readonly configService: ConfigService) {}

  connect(): DrizzleDB {
    const connectionString = this.configService.getOrThrow<string>(
      'POSTGRES_DATABASE_URL',
    );

    this.client = postgres(connectionString);
    const db = drizzle(this.client, {});

    this.logger.log('Connected to PostgreSQL');

    return db;
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    const client = this.client;

    if (!client) return;

    this.client = null;

    try {
      await client.end({ timeout: 5 });
      this.logger.log(`PostgreSQL connection closed (${signal ?? 'manual'})`);
    } catch (error) {
      this.logger.error('Failed to close PostgreSQL connection', error);
    }
  }
}
