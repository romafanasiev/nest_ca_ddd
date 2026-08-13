export class ProductSku {
  private static readonly SKU_PATTERN = /^[A-Za-z0-9-]+$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 50;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ProductSku {
    const trimmed = value.trim();

    if (trimmed.length < this.MIN_LENGTH || trimmed.length > this.MAX_LENGTH) {
      throw new Error(
        `SKU must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH}`,
      );
    }

    if (!this.SKU_PATTERN.test(trimmed)) {
      throw new Error(
        `SKU must contain only alphanumeric characters and dashes`,
      );
    }

    return new ProductSku(trimmed.toUpperCase());
  }

  equals(sku: ProductSku): boolean {
    return this.getValue() === sku.getValue();
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.getValue().toString();
  }
}
