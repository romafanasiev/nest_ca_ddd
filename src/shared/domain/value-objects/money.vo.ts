export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    const normalized = Math.round(amount * 100) / 100;

    return new Money(normalized, currency.toUpperCase());
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    if (!Number.isInteger(cents)) {
      throw new Error('Money cents must be an integer');
    }

    return Money.create(cents / 100, currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  toCents(): number {
    return Math.round(this.amount * 100);
  }
}
