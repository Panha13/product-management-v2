import { Component, OnInit } from '@angular/core';
import { Language } from '../app.component';
import { NzI18nService, en_US, km_KH } from 'ng-zorro-antd/i18n';
import { TranslateService } from '@ngx-translate/core';

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
            <a routerLink="/attributes">
              <i nz-icon nzType="tags"></i>
              <span>{{ 'Attributes' | translate }}</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter nzDisabled>
            <a routerLink="/order">
              <i nz-icon nzType="shopping"></i>
              <span>{{ 'Order' | translate }}</span>
            </a>
          </li>
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

            <div class="flex-nowrap">
              <nz-avatar
                nzIcon="user"
                nzSize="large"
                nzSrc="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              ></nz-avatar>
              <h4 class="margin-zero">Tith Sopanha</h4>
            </div>
          </div>
        </nz-header>
        <nz-content class="content-layout">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [],
})
export class PageComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private i18n: NzI18nService
  ) {}
  isCollapsed = false;

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
  }

  switchLanguage(lang: Language): void {
    this.selectedLanguage = lang;
    this.translateService.use(lang.code);
    this.i18n.setLocale(lang.code === 'km' ? km_KH : en_US);
    localStorage.setItem('selectedLang', lang.code);
  }
}
