import { Injectable } from '@angular/core';

export interface Language {
  name: string;
  code: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private defaultLanguage = 'en';
  private storageKey = 'selectedLang';
  private selectedLang: Language;

  private languages: Language[] = [
    {
      name: 'English',
      code: 'en',
      flag: '../assets/english-sharp-icon.svg',
    },
    { name: 'Khmer', code: 'km', flag: '../assets/khmer-sharp-icon.svg' },
  ];

  constructor() {
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang) {
      this.selectedLang =
        this.languages.find((lang) => lang.code === storedLang) ||
        this.getDefaultLanguage();
    } else {
      this.selectedLang = this.getDefaultLanguage();
    }
  }

  private getDefaultLanguage(): Language {
    return this.languages.find((lang) => lang.code === this.defaultLanguage)!;
  }
  getLanguages(): Language[] {
    return this.languages;
  }
  getSelectedLanguage(): Language {
    return this.selectedLang;
  }
  setSelectedLanguage(langCode: string): void {
    const lang = this.languages.find((language) => language.code === langCode);
    if (lang) {
      this.selectedLang = lang;
      localStorage.setItem(this.storageKey, langCode);
    }
  }
}
