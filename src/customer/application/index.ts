import { DeleteCustomerHandler } from './commands/delete-customer/delete-customer.handler';
import { RegisterCustomerHandler } from './commands/register-customer/register-customer.handler';

export const CommandHandlers = [RegisterCustomerHandler, DeleteCustomerHandler];
