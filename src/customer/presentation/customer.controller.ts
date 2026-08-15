import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from '../application/commands/delete-customer/delete-customer.command';
import { RegisterCustomerCommand } from '../application/commands/register-customer/register-customer.command';
import { GetCustomerByEmailQuery } from '../application/queries/get-customer-by-email.query';
import { GetCustomerQuery } from '../application/queries/get-customer.query';
import { ListCustomersQuery } from '../application/queries/list-customers.query';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async register(@Body() dto: RegisterCustomerDto): Promise<void> {
    await this.commandBus.execute<RegisterCustomerCommand, void>(
      new RegisterCustomerCommand(
        dto.email,
        dto.firstName,
        dto.lastName,
        dto.phone,
      ),
    );
  }

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.queryBus.execute<
      ListCustomersQuery,
      Customer[]
    >(new ListCustomersQuery());

    return customers.map((customer) =>
      CustomerResponseDto.fromDomain(customer),
    );
  }

  @Get('by-email')
  async findOneByEmail(
    @Query('email') email: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<
      GetCustomerByEmailQuery,
      Customer
    >(new GetCustomerByEmailQuery(email));

    return CustomerResponseDto.fromDomain(customer);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
      new GetCustomerQuery(id),
    );

    return CustomerResponseDto.fromDomain(customer);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<DeleteCustomerCommand, void>(
      new DeleteCustomerCommand(id),
    );
  }
}
