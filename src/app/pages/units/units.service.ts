import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Unit {
  unit_id: number;
  name: string;
  description: string;
}
@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  constructor(private http: HttpClient) {}
  private _apiUrl = 'http://localhost:3000/api/units';

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this._apiUrl);
  }
}
