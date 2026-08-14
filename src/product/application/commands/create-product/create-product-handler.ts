import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductSku } from 'src/product/domain/value-objects/product-sku.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/shared/domain/exceptions/application.exception';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../ports/product.repository.port';
import { CreateProductCommand } from './create-product.command';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<
  CreateProductCommand,
  void
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand) {
    const existingSku = await this.productRepository.findBySku(
      ProductSku.create(command.sku),
    );

    if (existingSku) {
      throw new ApplicationException(
        `Product with SKU ${command.sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingByName = await this.productRepository.findByName(
      command.name,
    );

    if (existingByName) {
      throw new ApplicationException(
        `Product with name ${command.name} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const product = Product.create({
      name: command.name,
      description: command.description,
      sku: command.sku,
      price: command.price,
      currency: command.currency,
      stock: command.stock,
    });

    await this.productRepository.save(product);
  }
}
