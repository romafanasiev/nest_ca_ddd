import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db, Filter } from 'mongodb';
import {
  ProductFilters,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { ProductSku } from 'src/product/domain/value-objects/product-sku.vo';
import {
  MongoProductMapper,
  ProductDocument,
} from 'src/product/infrastructure/mappers/mongo-product.mapper';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { MONGO_DB } from 'src/shared/infrastructure/database/mongodb/mongo.provider';

@Injectable()
export class MongoProductRepository implements ProductRepository {
  private readonly collection: Collection<ProductDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<ProductDocument>('products');
  }

  async save(product: Product): Promise<void> {
    const doc = MongoProductMapper.toPersistence(product);

    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true },
    );
  }

  async findById(id: ProductId): Promise<Product | null> {
    const doc = await this.collection.findOne({ _id: id.getValue() });

    if (!doc) return null;

    return MongoProductMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<Product | null> {
    const doc = await this.collection.findOne({ name });

    if (!doc) return null;

    return MongoProductMapper.toDomain(doc);
  }

  async findBySku(sku: ProductSku): Promise<Product | null> {
    const doc = await this.collection.findOne({ sku: sku.getValue() });

    if (!doc) return null;

    return MongoProductMapper.toDomain(doc);
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const query: Filter<ProductDocument> = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const priceRange: { $gte?: number; $lte?: number } = {};

    if (filters?.minPrice !== undefined) {
      priceRange.$gte = Money.create(filters.minPrice).toCents();
    }

    if (filters?.maxPrice !== undefined) {
      priceRange.$lte = Money.create(filters.maxPrice).toCents();
    }

    if (Object.keys(priceRange).length > 0) {
      query.priceAmount = priceRange;
    }

    const docs = await this.collection.find(query).toArray();

    return docs.map((doc) => MongoProductMapper.toDomain(doc));
  }

  async deleteById(id: ProductId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }
}
