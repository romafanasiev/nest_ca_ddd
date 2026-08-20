import { UniqueId } from 'src/shared/domain/value-objects/unique-id.vo';

export class OrderItemId extends UniqueId {
  constructor(id?: string) {
    super(id);
  }
}
