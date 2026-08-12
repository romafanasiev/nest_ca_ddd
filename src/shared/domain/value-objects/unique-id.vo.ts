import { randomUUID } from 'crypto';

export class UniqueId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(id: UniqueId): boolean {
    return this.value === id.value;
  }

  toString(): string {
    return this.value;
  }
}
