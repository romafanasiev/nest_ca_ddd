import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoConnection implements OnApplicationShutdown {
  private readonly logger = new Logger(MongoConnection.name);
  private client: MongoClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  async connect(): Promise<Db> {
    const uri = this.configService.getOrThrow<string>('MONGO_DB_URI');
    const dbName = this.configService.getOrThrow<string>('MONGO_DB_NAME');

    this.client = new MongoClient(uri);
    await this.client.connect();
    this.logger.log(`Connected to MongoDB database "${dbName}"`);

    return this.client.db(dbName);
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    const client = this.client;

    if (!client) return;

    this.client = null;

    try {
      await client.close();
      this.logger.log(`MongoDB connection closed (${signal ?? 'manual'})`);
    } catch (error) {
      this.logger.error('Failed to close MongoDB connection', error);
    }
  }
}
