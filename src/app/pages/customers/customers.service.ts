import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helpers/base-api.service';

export interface Customer {
  id?: number;
  code?: string;
  image?: string;
  name?: string;
  email?: string;
  phone?: string;
  customerType?: {
    id?: number;
    name?: string;
  };
  address?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService extends BaseApiService<Customer> {
  constructor(protected override http: HttpClient) {
    super(http, 'customers');
  }
}
