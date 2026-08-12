import { UniqueId } from './value-objects/unique-id.vo';

export abstract class Entity<T extends UniqueId = UniqueId> {
  constructor(protected readonly id: T) {}

  getId(): T {
    return this.id;
  }

  equals(entity: Entity): boolean {
    if (entity === null || entity === undefined) return false;

    if (this === entity) return true;

    return this.id.equals(entity.id);
  }
}
