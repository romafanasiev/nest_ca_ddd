import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import { ProductSku } from 'src/product/domain/value-objects/product-sku.vo';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: ProductId): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findBySku(sku: ProductSku): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  deleteById(id: ProductId): Promise<void>;
}
