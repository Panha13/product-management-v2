import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helpers/base-api.service';

export interface Category {
  id?: number;
  name?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends BaseApiService<Category> {
  constructor(protected override http: HttpClient) {
    super(http, 'categories');
  }
}
