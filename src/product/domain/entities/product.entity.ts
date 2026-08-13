import { AggregateRoot } from 'src/shared/domain/aggregate-root';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { ProductId } from '../value-objects/product-id.vo';
import { ProductSku } from '../value-objects/product-sku.vo';

export interface ProductProps {
  id: ProductId;
  name: string;
  description: string;
  price: Money;
  sku: ProductSku;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
  private _id: ProductId;
  private _name: string;
  private _description: string;
  private _price: Money;
  private _sku: ProductSku;
  private _stock: number;
  private _isActive: boolean;
  private _lowStockThreshold: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ProductProps) {
    const {
      id,
      name,
      description,
      price,
      sku,
      stock,
      isActive,
      lowStockThreshold,
      createdAt,
      updatedAt,
    } = props;

    super();

    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._sku = sku;
    this._stock = stock;
    this._isActive = isActive;
    this._lowStockThreshold = lowStockThreshold;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create({
    name,
    description,
    sku,
    price,
    currency,
    stock,
  }: {
    name: string;
    description: string;
    sku: string;
    price: number;
    currency: string;
    stock: number;
  }) {
    Product.validateName(name);
    Product.validateStock(stock);

    const defaultDate = new Date();

    return new Product({
      id: new ProductId(),
      name,
      description,
      sku: ProductSku.create(sku),
      price: Money.create(price, currency),
      stock,
      isActive: true,
      lowStockThreshold: 5,
      createdAt: defaultDate,
      updatedAt: defaultDate,
    });
  }

  private static validateName(name: string) {
    if (name.length > 2) {
      throw new Error('Product name must be at least 3 characters');
    }
  }

  private static validateStock(stock: number) {
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): Money {
    return this._price;
  }

  get sku(): ProductSku {
    return this._sku;
  }

  get stock(): number {
    return this._stock;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get lowStockThreshold(): number {
    return this._lowStockThreshold;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
