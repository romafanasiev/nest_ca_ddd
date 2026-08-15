import { Customer } from 'src/customer/domain/entities/customer.entity';

export class CustomerResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    dto.id = customer.getId().getValue();
    dto.email = customer.getEmail().getValue();
    dto.firstName = customer.getFirstName();
    dto.lastName = customer.getLastName();
    dto.fullName = customer.getFullName();
    dto.phone = customer.getPhone();
    dto.isActive = customer.getIsActive();
    dto.createdAt = customer.getCreatedAt().toISOString();
    dto.updatedAt = customer.getUpdatedAt().toISOString();

    return dto;
  }
}
