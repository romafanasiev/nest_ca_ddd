import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class RegisterCustomerDto {
  @IsEmail()
  @Length(3, 255)
  email: string;

  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @Length(1, 100)
  lastName: string;

  @IsString()
  @Length(3, 20)
  @IsOptional()
  phone?: string;
}
