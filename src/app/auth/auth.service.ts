import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export interface userInfo {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private AUTH_API: string = environment.apiUrl;
  userInfo: userInfo = JSON.parse(<string>localStorage.getItem('user'));

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        this.AUTH_API + '/login',
        {
          email,
          password,
        },
        httpOptions
      )
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.userInfo = response.user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
