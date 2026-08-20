import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

interface ShippingAddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class ShippingAddress {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _zipCode: string;
  private readonly _country: string;

  private constructor({
    street,
    city,
    state,
    zipCode,
    country,
  }: ShippingAddressProps) {
    this._street = street;
    this._city = city;
    this._state = state;
    this._zipCode = zipCode;
    this._country = country;
  }

  static create({
    street,
    city,
    state,
    zipCode,
    country,
  }: ShippingAddressProps): ShippingAddress {
    if (!street || street.trim().length === 0) {
      throw new DomainException('Shipping street is required');
    }

    if (!city || city.trim().length === 0) {
      throw new DomainException('Shipping city is required');
    }

    if (!state || state.trim().length === 0) {
      throw new DomainException('Shipping state is required');
    }

    if (!zipCode || zipCode.trim().length === 0) {
      throw new DomainException('Shipping zipCode is required');
    }

    if (!country || country.trim().length === 0) {
      throw new DomainException('Shipping country is required');
    }

    return new ShippingAddress({
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim().toUpperCase(),
    });
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get country(): string {
    return this._country;
  }

  equals(other: ShippingAddress): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    );
  }
}
