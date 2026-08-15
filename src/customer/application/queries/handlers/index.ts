import { GetCustomerByEmailHandler } from './get-customer-by-email.handler';
import { GetCustomerHandler } from './get-customer.handler';
import { ListCustomersHandler } from './list-customers.handler';

export const QueryHandlers = [
  ListCustomersHandler,
  GetCustomerHandler,
  GetCustomerByEmailHandler,
];
