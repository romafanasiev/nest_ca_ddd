import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { ProductSku } from 'src/product/domain/value-objects/product-sku.vo';
import { Money } from 'src/shared/domain/value-objects/money.vo';

export interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  sku: string;
  priceAmount: number;
  priceCurrency: string;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoProductMapper {
  static toPersistence(product: Product): ProductDocument {
    return {
      _id: product.id.getValue(),
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

  static toDomain(doc: ProductDocument): Product {
    return Product.reconstitute({
      id: new ProductId(doc._id),
      name: doc.name,
      description: doc.description,
      sku: ProductSku.create(doc.sku),
      price: Money.fromCents(doc.priceAmount, doc.priceCurrency),
      stock: doc.stock,
      isActive: doc.isActive,
      lowStockThreshold: doc.lowStockThreshold,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
