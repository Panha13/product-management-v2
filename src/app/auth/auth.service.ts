import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private url: string = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    // debugger;
    return this.http.post(`${this.url}/login`, { email, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('Token'); // Check if token exists
  }
  logout() {
    localStorage.removeItem('token');
  }
}
