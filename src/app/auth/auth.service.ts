import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private AUTH_API: string = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      this.AUTH_API + '/login',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = window.location.origin + '/login';
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
