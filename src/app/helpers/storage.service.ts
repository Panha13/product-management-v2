// import { Injectable } from '@angular/core';
// import { retry } from 'rxjs';

// const USER_KEY = 'auth-user';

// @Injectable({
//   providedIn: 'root',
// })
// export class StorageService {
//   constructor() {}

//   clean(): void {
//     sessionStorage.clear();
//   }
//   saveUser(user: any): void {
//     sessionStorage.removeItem(USER_KEY);
//     sessionStorage.setItem(USER_KEY, JSON.stringify(user));
//   }

//   getUser(): any {
//     const user = sessionStorage.getItem(USER_KEY);
//     if (user) {
//       return JSON.parse(user);
//     }

//     return {};
//   }

//   isLoggedIn(): any {
//     const token = localStorage.getItem('token');
//     if (token) {
//       console.log(token);
//       return true;
//     }
//   }
// }
