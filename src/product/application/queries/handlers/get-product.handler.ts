import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductId } from 'src/product/domain/value-objects/product-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../ports/product.repository.port';
import { GetProductQuery } from '../get-product.query';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<
  GetProductQuery,
  Product
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery) {
    const product = await this.productRepository.findById(
      new ProductId(query.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${query.id} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return product;
  }
}
