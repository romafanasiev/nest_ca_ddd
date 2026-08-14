import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';
import {
  ProductFilters,
  ProductRepository,
} from 'src/product/application/ports/product.repository.port';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { ProductSku } from 'src/product/domain/value-objects/product-sku.vo';
import { ProductMapper } from 'src/product/infrastructure/mappers/product.mapper';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import {
  DRIZZLE,
  type DrizzleDB,
} from 'src/shared/infrastructure/database/postgres/drizzle.provider';
import { products } from 'src/shared/infrastructure/database/postgres/schema';

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(product: Product): Promise<void> {
    const row = ProductMapper.toPersistence(product);

    const { id, createdAt, ...updatable } = row;

    await this.db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({ target: products.id, set: updatable });
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.getValue()));

    if (rows.length === 0) return null;

    return ProductMapper.toDomain(rows[0]);
  }

  async findByName(name: string): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.name, name));

    if (rows.length === 0) return null;

    return ProductMapper.toDomain(rows[0]);
  }

  async findBySku(sku: ProductSku): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.sku, sku.getValue()));

    if (rows.length === 0) return null;

    return ProductMapper.toDomain(rows[0]);
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const conditions: SQL[] = [];

    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(
        gte(products.priceAmount, Money.create(filters.minPrice).toCents()),
      );
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(
        lte(products.priceAmount, Money.create(filters.maxPrice).toCents()),
      );
    }

    const query = this.db.select().from(products);

    const productRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return productRows.map((row) => ProductMapper.toDomain(row));
  }
}
