export class CustomerRegisteredEvent {
  public readonly customerId: string;
  public readonly email: string;
  public readonly firstName: string;

  constructor({
    customerId,
    email,
    firstName,
  }: {
    customerId: string;
    email: string;
    firstName: string;
  }) {
    this.customerId = customerId;
    this.email = email;
    this.firstName = firstName;
  }
}
