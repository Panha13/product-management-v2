import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomValidators } from '../helpers/customValidators';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
      <div class="logo">
        <a>
          <img src="../assets/image/logo.svg" alt="logo" />
          <h1>Products</h1>
        </a>
      </div>
      <div class="login">
        <h1 class="title">Sign in</h1>
        <nz-alert
          *ngIf="credential"
          nzType="error"
          [nzMessage]="credential"
          nzCloseable
          (nzOnClose)="credential = null"
        ></nz-alert>
        <form nz-form [formGroup]="frm" [nzLayout]="'vertical'">
          <nz-form-item>
            <nz-form-label>Email Address</nz-form-label>
            <nz-form-control [nzErrorTip]="emailErrorTip">
              <input
                nz-input
                formControlName="email"
                type="email"
                [placeholder]="'Enter email address'"
              />
              <ng-template #emailErrorTip let-control>
                <ng-container *ngIf="control.hasError('required')"
                  >Email is required.</ng-container
                >
                <ng-container *ngIf="control.hasError('email')"
                  >Invalid email address.</ng-container
                >
              </ng-template>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>Password</nz-form-label>
            <nz-form-control [nzErrorTip]="pwErrorTips">
              <nz-input-group [nzSuffix]="suffixIcon">
                <input
                  nz-input
                  formControlName="password"
                  [type]="passwordVisible ? 'text' : 'password'"
                  [placeholder]="'Enter password'"
                />
                <ng-template #suffixIcon>
                  <button
                    nz-button
                    nzType="link"
                    (click)="togglePassword()"
                    class="password-toggle-button"
                  >
                    <i
                      nz-icon
                      [nzType]="passwordVisible ? 'eye' : 'eye-invisible'"
                    ></i>
                  </button>
                </ng-template>
              </nz-input-group>
              <ng-template #pwErrorTips let-control>
                <ng-container *ngIf="control.hasError('required')">
                  Password is required
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
          <div nz-row class="login-form-margin">
            <div nz-col [nzSpan]="12">
              <label nz-checkbox name="remember">
                <span>Remember me</span>
              </label>
            </div>
            <div nz-col [nzSpan]="12">
              <a class="login-form-forgot">Forgot password?</a>
            </div>
          </div>
          <button
            nz-button
            class="login-form-button login-form-margin"
            nzSize="large"
            [nzType]="'primary'"
            [nzLoading]="loading"
            [disabled]="loading || !frm.valid"
            (click)="onSubmit()"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .title {
        font-weight: bold;
        margin-bottom: 28px;
      }
      .container {
        background-color: #f0f2f5;
        width: 100svw;
        height: 100svh;
        padding: 18px 24px;
      }

      .logo img {
        display: inline-block;
        height: 60px;
        width: 60px;
        vertical-align: middle;
      }

      .logo h1 {
        display: inline-block;
        margin: 0 0 0 10px;
        font-weight: 700;
        font-size: 28px;
        vertical-align: middle;
      }
      .login {
        background-color: white;
        padding: 32px 48px;
        border-radius: 18px;
        width: 540px;
        margin: 24px auto;
      }
      .login-form-margin {
        margin-bottom: 32px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
        border-radius: 8px;
      }
      :host ::ng-deep .ant-input {
        border-radius: 8px;
        padding: 8px 12px;
      }
      :host ::ng-deep .ant-input-affix-wrapper {
        padding: 3px 12px;
        border-radius: 8px;
      }
      :host ::ng-deep .ant-form-item-label > label {
        font-weight: 500;
      }

      :host ::ng-deep .ant-alert {
        margin-bottom: 8px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private msg: NzMessageService
  ) {}

  frm!: FormGroup;
  loading: boolean = false;
  credential: string | null = null;
  passwordVisible: boolean = false;

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.frm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.loading = true;
    if (this.frm.valid) {
      const { email, password } = this.frm.value;

      this.auth.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.credential = 'Invalid Credentials!';
          }
        },
      });
    }
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
