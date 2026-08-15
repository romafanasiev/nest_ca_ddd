import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CustomerRepositoryPort } from 'src/customer/application/ports/customer.repository.port';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id.vo';
import { Email } from 'src/customer/domain/value-objects/email.vo';
import { DrizzleCustomerMapper } from 'src/customer/infrastructure/mappers/drizzle-customer.mapper';
import {
  DRIZZLE,
  type DrizzleDB,
} from 'src/shared/infrastructure/database/postgres/drizzle.provider';
import { customers } from 'src/shared/infrastructure/database/postgres/schema';

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(customer: Customer): Promise<void> {
    const row = DrizzleCustomerMapper.toPersistence(customer);

    const { id, createdAt, ...updatable } = row;

    await this.db
      .insert(customers)
      .values(row)
      .onConflictDoUpdate({ target: customers.id, set: updatable });
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id.getValue()));

    if (rows.length === 0) return null;

    return DrizzleCustomerMapper.toDomain(rows[0]);
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    if (rows.length === 0) return null;

    return DrizzleCustomerMapper.toDomain(rows[0]);
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.db.select().from(customers);

    return rows.map((row) => DrizzleCustomerMapper.toDomain(row));
  }

  async deleteCustomer(id: CustomerId): Promise<void> {
    await this.db.delete(customers).where(eq(customers.id, id.getValue()));
  }
}
