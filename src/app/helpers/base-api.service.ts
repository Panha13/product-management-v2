import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface QueryParam {
  pageIndex?: number;
  pageSize?: number;
  filters?: any;
  sort?: string;
}

export class BaseApiService<T> {
  constructor(protected http: HttpClient, private endpoint: string) {}

  protected apiUrl = environment.apiUrl;
  private getEndpoint(): string {
    return `${this.apiUrl}/${this.endpoint}`;
  }

  // search(params: QueryParam): Observable<any> {
  //   const httpParams = new HttpParams()
  //     .set('page', params.pageIndex.toString())
  //     .set('pageSize', params.pageSize.toString())
  //     .set('searchQuery', params.searchQuery);

  //   return this.http.get<any>(this.getEndpoint(), { params: httpParams });
  // }

  search(params: QueryParam): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', `${params.pageIndex}`)
      .set('pageSize', `${params.pageSize}`)
      .set('filters', `${params.filters === undefined ? '' : params.filters}`)
      .set('sort', `${params.sort === undefined ? '' : params.sort}`);

    return this.http.get<any>(this.getEndpoint(), { params: httpParams });
  }

  // search(params: QueryParam): Observable<any> {
  //   const httpParams = new HttpParams()
  //     .set('page', params.pageIndex.toString())
  //     .set('pageSize', params.pageSize.toString())
  //     .set('filters', `${params.filters === undefined ? '' : params.filters}`)
  //     .set('sort', `${params.sort === undefined ? '' : params.sort}`);

  //   return this.http.get<any>(this.getEndpoint(), { params: httpParams });
  // }

  find(id: number): Observable<T> {
    return this.http.get<T>(`${this.getEndpoint()}/${id}`);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(this.getEndpoint(), item);
  }

  edit(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.getEndpoint()}/${id}`, item);
  }

  delete(id: number, note?: string): Observable<void> {
    return this.http.delete<void>(`${this.getEndpoint()}/${id}`, {
      body: { note },
    });
  }

  exist(name: string = '', id: number = 0): Observable<boolean> {
    let httpParams = new HttpParams();

    if (name) {
      httpParams = httpParams.append('name', name);
    }
    httpParams = httpParams.append('id', `${id}`);
    return this.http.get<boolean>(`${this.getEndpoint()}/exists`, {
      params: httpParams,
    });
  }
}
