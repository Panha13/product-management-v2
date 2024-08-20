import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, en_US, km_KH } from 'ng-zorro-antd/i18n';

export interface Language {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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
