import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export class Email {
  private readonly value: string;
  private static readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      throw new DomainException('Email cannot be empty');
    }

    if (!this.EMAIL_PATTERN.test(trimmed)) {
      throw new DomainException('Invalid email format');
    }

    return new Email(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(email: Email) {
    return this.getValue() === email.getValue();
  }

  toString() {
    return this.getValue().toString();
  }
}
