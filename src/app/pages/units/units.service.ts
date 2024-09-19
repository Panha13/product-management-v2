import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helpers/base-api.service';

export interface Unit {
  id?: number;
  name?: string;
  description?: string;
}
@Injectable({
  providedIn: 'root',
})
export class UnitsService extends BaseApiService<Unit> {
  constructor(protected override http: HttpClient) {
    super(http, 'units');
  }
}
