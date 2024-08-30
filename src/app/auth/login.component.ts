import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

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
        <form nz-form [formGroup]="frm" [nzLayout]="'vertical'">
          <nz-form-item>
            <nz-form-label>Email Address</nz-form-label>
            <nz-form-control>
              <input
                nz-input
                formControlName="email"
                type="email"
                [placeholder]="'Enter email address' | translate"
              />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>Password</nz-form-label>
            <nz-form-control>
              <input
                nz-input
                formControlName="password"
                type="password"
                [placeholder]="'Enter password' | translate"
              />
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
        box-sizing: border-box;
        margin: 0;
        font-variant: tabular-nums;
        position: relative;
        display: inline-block;
        color: rgba(0, 0, 0, 0.85);
        background-image: none;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        padding: 8px 12px;
      }
      :host ::ng-deep .ant-form-item-label > label {
        font-weight: 500;
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
    if (this.frm.valid) {
      const { email, password } = this.frm.value;

      this.auth.login(email, password).subscribe({
        next: (result) => {
          this.auth.saveToken(result.token);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.log(error);
          this.msg.error(error.message);
        },
      });
    }
  }
}
