import { Component, OnInit } from '@angular/core';
import { NzI18nService, en_US, km_KH } from 'ng-zorro-antd/i18n';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface Language {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-page',
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzTheme="light"
        nzWidth="240px"
        nzBreakpoint="xl"
        [(nzCollapsed)]="isCollapsed"
      >
        <div class="sidebar-logo">
          <a routerLink="dashboard">
            <img src="../assets/image/logo.svg" alt="logo" />
            <h1>Products</h1>
          </a>
        </div>
        <ul
          nz-menu
          nzTheme="light"
          nzMode="inline"
          [nzInlineCollapsed]="isCollapsed"
          class="custom-menu"
        >
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/dashboard">
              <i nz-icon nzType="dashboard"></i>
              <span>{{ 'Dashboard' | translate }}</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/products">
              <i nz-icon nzType="shopping-cart"></i>
              <span>{{ 'Products' | translate }}</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/categories">
              <i nz-icon nzType="appstore"></i>
              <span>{{ 'Categories' | translate }}</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/units">
              <i nz-icon nzType="tags"></i>
              <span>{{ 'Units' | translate }}</span>
            </a>
          </li>
          <!-- <li nz-menu-item nzMatchRouter nzDisabled>
        <a routerLink="/order">
          <i nz-icon nzType="shopping"></i>
          <span>{{'Order'| translate}}</span>
        </a>
      </li> -->
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/user">
              <i nz-icon nzType="user"></i>
              <span>{{ 'User' | translate }}</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout class="layout-container">
        <nz-header nz-row nzJustify="space-between" class="app-header">
          <div nz-col class="flex-nowrap">
            <span class="header-trigger" (click)="isCollapsed = !isCollapsed">
              <span
                class="trigger"
                nz-icon
                [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'"
              ></span>
            </span>
            <!-- <app-search-input></app-search-input> -->
          </div>
          <div nz-col class="flex-nowrap">
            <nz-badge [nzCount]="5">
              <div class="icon-tag">
                <span nz-icon nzType="bell" nzTheme="outline"></span>
              </div>
            </nz-badge>
            <nz-badge [nzCount]="5">
              <div class="icon-tag">
                <span nz-icon nzType="message" nzTheme="outline"></span>
              </div>
            </nz-badge>
            <div class="icon-tag">
              <span nz-icon nzType="appstore" nzTheme="outline"></span>
            </div>

            <!-- Languages -->
            <div class="icon-tag">
              <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
                <img
                  class="flag"
                  [src]="selectedLanguage.flag"
                  [alt]="selectedLanguage.name"
                />
              </div>
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li
                    *ngFor="let lang of languages"
                    nz-menu-item
                    (click)="switchLanguage(lang)"
                    [ngClass]="{ active: lang.code === selectedLanguage.code }"
                  >
                    <img class="flag" [src]="lang.flag" [alt]="lang.name" />
                    {{ lang.name }}
                    <span *ngIf="lang.code === selectedLanguage.code">✔️</span>
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>

            <div
              class="profile"
              nz-dropdown
              nzTrigger="click"
              [nzDropdownMenu]="profile"
            >
              <nz-avatar
                nzIcon="user"
                nzSize="large"
                [nzSrc]="userInfo.image || '../../assets/image/user.svg'"
              ></nz-avatar>
              <h4 class="margin-zero">{{ userInfo.name | titlecase }}</h4>
            </div>
            <nz-dropdown-menu #profile="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item>
                  <span
                    nz-icon
                    nzType="user"
                    nzTheme="outline"
                    class="margin-right-10"
                  ></span
                  >{{ 'Profile' | translate }}
                </li>
                <li nz-menu-item nzDanger (click)="cfmLogout()">
                  <span
                    nz-icon
                    nzType="logout"
                    nzTheme="outline"
                    class="margin-right-10"
                  ></span
                  >{{ 'Logout' | translate }}
                </li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </nz-header>
        <nz-content class="content-layout">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .profile {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .margin-right-10 {
        margin-right: 10px;
      }
      .profile:hover {
        cursor: pointer;
      }

      .app-layout {
        height: 100vh;
      }

      .menu-sidebar {
        position: relative;
        z-index: 10;
        min-height: 100vh;
        box-shadow: 1px 0 6px rgba(0, 21, 41, 0.1);
      }

      .custom-menu {
        margin-top: 10px;
      }

      .custom-menu li {
        height: 48px;
        margin: 0;
      }
      .custom-menu li a {
        display: flex;
        align-items: center;
      }

      .custom-menu li a i {
        font-size: 18px; /* Adjust the font size for the icons */
        margin-right: 7px; /* Add space between the icon and the text */
        font-weight: 500;
      }

      .custom-menu li a span {
        font-size: 14px; /* Adjust the font size for the text */
        font-weight: 500;
      }

      .header-trigger {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        padding: 20px 24px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s, padding 0s;
      }

      .trigger:hover {
        color: #1890ff;
      }

      .sidebar-logo {
        position: relative;
        height: 64px;
        padding-left: 24px;
        overflow: hidden;
        line-height: 64px;
        transition: all 0.3s;
        border-bottom: 1px solid #f0f2f5;
      }

      .sidebar-logo img {
        display: inline-block;
        height: 42px;
        width: 42px;
        vertical-align: middle;
      }

      .sidebar-logo h1 {
        display: inline-block;
        margin: 0 0 0 15px;
        font-weight: 700;
        font-size: 24px;
        vertical-align: middle;
      }

      nz-header {
        padding: 0;
        width: 100%;
        z-index: 2;
      }

      .layout-container {
        max-width: none;
        min-width: 1000px;
      }

      .content-layout {
        overflow: auto;
        padding: 18px;
      }

      .app-layout .app-header {
        height: 64px;
        padding: 0 24px 0 0;
        background: #fefefe;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        flex-wrap: nowrap;
      }

      .icon-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #eff2f6;
        cursor: pointer;
      }
      .icon-tag span {
        font-size: 18px;
      }

      .flex-nowrap {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 15px;
      }

      .flag {
        width: 20px;
        height: 20px;
      }

      :host ::ng-deep .ant-badge-count,
      .ant-badge-dot {
        position: absolute;
        top: 5px;
        right: 4px;
        transform: translate(50%, -50%);
        transform-origin: 100% 0;
      }

      li.active.ant-dropdown-menu-item.ng-star-inserted {
        background-color: whitesmoke;
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private i18n: NzI18nService,
    public authService: AuthService,
    private modalService: NzModalService
  ) {}
  isCollapsed = false;
  userInfo: any;

  //Language
  selectedLanguage!: Language;
  defaultLanguage = 'en';

  languages: Language[] = [
    {
      name: 'English',
      code: 'en',
      flag: '../assets/image/english-sharp-icon.svg',
    },
    { name: 'Khmer', code: 'km', flag: '../assets/image/khmer-sharp-icon.svg' },
  ];

  private getDefaultLanguage(): Language {
    return this.languages.find((lang) => lang.code === this.defaultLanguage)!;
  }

  ngOnInit(): void {
    const storedLang =
      localStorage.getItem('selectedLang') || this.defaultLanguage;
    this.selectedLanguage =
      this.languages.find((lang) => lang.code === storedLang) ||
      this.getDefaultLanguage();
    this.translateService.use(this.selectedLanguage.code);
    this.i18n.setLocale(this.selectedLanguage.code === 'km' ? km_KH : en_US);

    //Get user info when logged in
    this.userInfo = this.authService.userInfo;
  }

  switchLanguage(lang: Language): void {
    this.selectedLanguage = lang;
    this.translateService.use(lang.code);
    this.i18n.setLocale(lang.code === 'km' ? km_KH : en_US);
    localStorage.setItem('selectedLang', lang.code);
  }

  cfmLogout(): void {
    this.modalService.confirm({
      nzTitle: 'Logout Account',
      nzContent: 'Are you sure want to logout?',
      nzOkText: 'Logout',
      nzCancelText: 'Cancel',
      nzMaskClosable: true,
      nzOkDanger: true,
      nzOnOk: () => {
        this.authService.logout();
      },
    });
  }
}
