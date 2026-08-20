import { DomainException } from '../exceptions/domain.exception';

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export class Money {
  private constructor(
    private readonly cents: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency: string = 'USD'): Money {
    if (!Number.isFinite(amount)) {
      throw new DomainException('Money amount must be a finite number');
    }

    if (amount < 0) {
      throw new DomainException('Money amount cannot be negative');
    }

    return new Money(
      Math.round(amount * 100),
      Money.normalizeCurrency(currency),
    );
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    if (!Number.isInteger(cents)) {
      throw new DomainException('Money cents must be an integer');
    }

    if (cents < 0) {
      throw new DomainException('Money amount cannot be negative');
    }

    return new Money(cents, Money.normalizeCurrency(currency));
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);

    return this.cents > other.cents;
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new DomainException(
        'Multiplication factor must be a finite number',
      );
    }

    if (factor < 0) {
      throw new DomainException('Multiplication factor cannot be less than 0');
    }

    return new Money(Math.round(this.cents * factor), this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);

    const result = this.cents - other.cents;

    if (result < 0) {
      throw new DomainException('Result of subtraction cannot be negative');
    }

    return new Money(result, this.currency);
  }

  getAmount(): number {
    return this.cents / 100;
  }

  getCurrency(): string {
    return this.currency;
  }

  toCents(): number {
    return this.cents;
  }

  private static normalizeCurrency(currency: string): string {
    const normalized = currency.trim().toUpperCase();

    if (!CURRENCY_CODE_PATTERN.test(normalized)) {
      throw new DomainException(
        `Invalid currency code: ${currency}. Expected an ISO 4217 alpha-3 code`,
      );
    }

    return normalized;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainException(
        `Cannot operate on Money with different currencies: ${this.currency} and ${other.currency}`,
      );
    }
  }
}
