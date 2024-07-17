import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Users } from './users';
import { UserService } from './userService.service';

@Component({
  selector: 'app-add-user',
  template: `
    <div>
      <form nz-form [formGroup]="userForm" (ngSubmit)="submitForm()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Username</nz-form-label>
          <nz-form-control [nzSpan]="14" nzErrorTip="Username is required">
            <input nz-input formControlName="username" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6">Image URL</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="image" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Role</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="role" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Phone</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="phone" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>Email</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="email" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item nz-row style="margin-top:20px;">
          <nz-form-control [nzSpan]="14" [nzOffset]="6">
            <button nz-button nzType="primary" [disabled]="userForm.invalid">
              Submit
            </button>
            <button nz-button nzType="default" (click)="handleCancel()">
              Cancel
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `,
  styles: [],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      image: [''],
      role: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm(): void {
    if (this.userForm.valid) {
      const newUser: Users = this.userForm.value;
      // this.userService.addUser(newUser);
      this.modal.close(newUser); // Pass the form data back to the parent component
    }
  }

  handleCancel(): void {
    this.modal.destroy(); // Close the modal
  }
}
