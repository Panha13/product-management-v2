import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Unit {
  unit_id?: number;
  name?: string;
  description?: string;
}
@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  private _apiUrl = 'http://localhost:3000/api/units';
  constructor(private http: HttpClient) {}

  getUnits(
    pageIndex: number,
    pageSize: number,
    searchQuery: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('searchQuery', searchQuery);
    return this.http.get<any>(this._apiUrl, { params });
  }

  getUnit(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this._apiUrl}/${id}`);
  }

  addUnit(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this._apiUrl, unit);
  }

  updateUnit(id: number, unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(`${this._apiUrl}/${id}`, unit);
  }

  deleteUnit(id: number, note?: string): Observable<void> {
    return this.http.delete<void>(`${this._apiUrl}/${id}`, {
      body: { note },
    });
  }
}
