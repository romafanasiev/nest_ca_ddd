import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { ProductSku } from 'src/product/domain/value-objects/product-sku.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { products } from 'src/shared/infrastructure/database/postgres/schema';

export type ProductRow = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;

export class ProductMapper {
  static toPersistence(product: Product): ProductInsert {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toDomain(row: ProductRow): Product {
    return Product.reconstitute({
      id: new ProductId(row.id),
      name: row.name,
      description: row.description,
      sku: ProductSku.create(row.sku),
      price: Money.fromCents(row.priceAmount, row.priceCurrency),
      stock: row.stock,
      isActive: row.isActive,
      lowStockThreshold: row.lowStockThreshold,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
