import { Component, OnInit } from '@angular/core';
import { Users } from './users';
import { UserService } from './userService.service';
import { UsersUiService } from './usersUi.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user',
  template: `
    <div class="inner-content">
      <div
        style="display: flex; flex-direction: column;  gap: 15px; height: 100%; "
      >
        <div
          nz-row
          nzJustify="space-between"
          nzAlign="middle"
          style="flex-shrink: 0;"
        >
          <div nz-row nzAlign="middle">
            <app-search-input></app-search-input>
          </div>
          <button
            nz-button
            nzSize="large"
            nzType="primary"
            nzGhost
            (click)="addUserModal()"
          >
            Add User
          </button>
        </div>

        <div nz-row style=" flex-grow: 1; overflow: auto;">
          <nz-table #basicTable [nzData]="userList" nzTableLayout="fixed">
            <thead>
              <tr>
                <th nzWidth="25%">User</th>
                <th nzWidth="25%">Phone</th>
                <th nzWidth="30%">Email</th>
                <th nzWidth="20%" style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of basicTable.data">
                <td>
                  <div nz-row>
                    <div nz-col class="user-image">
                      <img src="{{ data.image }}" alt="{{ data.username }}" />
                    </div>
                    <div nz-col class="user-info" style="margin-left:15px ;">
                      <h4>{{ data.username }}</h4>
                      <p>{{ data.role }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ data.phone }}</td>
                <td>{{ data.email }}</td>
                <td>
                  <nz-row
                    nzJustify="center"
                    style="gap: 10px; flex-wrap: nowrap;"
                  >
                    <button nz-button nzType="primary" nzGhost>
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button
                      nz-button
                      nzType="default"
                      nzDanger
                      (click)="deleteUser(data)"
                    >
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </nz-row>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-image > img {
        border-radius: 10px;
        overflow: hidden;
        width: 50px;
        height: 100%;
        object-fit: cover;
      }

      .user-info,
      h4,
      p {
        margin: 0;
      }

      .user-info > h4 {
        font-weight: 700;
      }
      .user-info > p {
        color: #666;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  userList: Users[] = [];

  constructor(
    private _usersService: UserService,
    private _usersUiService: UsersUiService
  ) {}

  ngOnInit(): void {
    this.userList = this._usersService.getUser();
  }

  addUserModal(): void {
    const modalRef: NzModalRef = this._usersUiService.addUserModal();

    modalRef.afterClose.subscribe((result: Users) => {
      if (result) {
        this.userList = [...this.userList, result];
        console.log('User added successfully!');
      }
    });
  }

  deleteUser(user: Users): void {
    this._usersUiService.deleteUserModal(user);
  }
}
