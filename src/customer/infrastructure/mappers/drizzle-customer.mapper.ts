import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { Email } from 'src/customer/domain/value-objects/email.vo';
import { customers } from 'src/shared/infrastructure/database/postgres/schema';

export type CustomerRow = typeof customers.$inferSelect;
export type CustomerInsert = typeof customers.$inferInsert;

export class DrizzleCustomerMapper {
  static toPersistence(customer: Customer): CustomerInsert {
    return {
      id: customer.getId().getValue(),
      email: customer.getEmail().getValue(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phone: customer.getPhone(),
      isActive: customer.getIsActive(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };
  }

  static toDomain(row: CustomerRow): Customer {
    return Customer.reconstitute({
      id: new CustomerId(row.id),
      email: Email.create(row.email),
      firstName: row.firstName,
      lastName: row.lastName,
      isActive: row.isActive,
      phone: row.phone,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
