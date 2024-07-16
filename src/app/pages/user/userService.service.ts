import { Injectable } from '@angular/core';
import { Users, usersData } from './users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: Users[] = usersData;

  constructor() {}
  getUser(): Users[] {
    return usersData;
  }

  addUser(user: Users): void {
    this.users.push(user);
  }

  deleteUser(key: string): void {
    this.users = this.users.filter((u) => u.key !== key);
    // You can add logic here to delete from a backend or storage
  }
}
