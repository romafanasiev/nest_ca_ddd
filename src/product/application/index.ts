import { CreateProductHandler } from './commands/create-product/create-product.handler';
import { DeleteProductHandler } from './commands/delete-product/delete-product.handler';

export const CommandHandlers = [CreateProductHandler, DeleteProductHandler];
