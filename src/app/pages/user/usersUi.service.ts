import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Users } from './users';
import { AddUserComponent } from './add-user.component';

@Injectable({
  providedIn: 'root',
})
export class UsersUiService {
  constructor(private modal: NzModalService) {}

  addUserModal(): NzModalRef {
    return this.modal.create({
      nzTitle: 'Add User',
      nzContent: AddUserComponent,
      nzFooter: null,
    });
  }
  deleteUserModal(user: Users): void {
    this.modal.confirm({
      nzTitle: 'Confirm delete',
      nzContent: `Are you sure you want to delete ${user.username}?`,
      nzOnOk: () => {
        console.log('Delete user: ', user);
      },
    });
  }
}
