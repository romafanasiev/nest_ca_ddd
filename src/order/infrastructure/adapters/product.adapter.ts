import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from 'src/order/application/ports/product.port';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from 'src/product/application/ports/product.repository.port';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';

@Injectable()
export class ProductAdapter implements ProductPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async exists(productId: string): Promise<boolean> {
    const product = await this.productRepository.findById(
      new ProductId(productId),
    );

    return product !== null;
  }
}
