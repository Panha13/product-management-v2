import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  TranslateService as MyTranslateService,
  Language,
} from './helpers/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private myTranslateService: MyTranslateService
  ) {}
  isCollapsed = false;
  languages: Language[] = [];
  selectedLanguage!: Language;

  ngOnInit(): void {
    this.languages = this.myTranslateService.getLanguages();
    this.selectedLanguage = this.myTranslateService.getSelectedLanguage();

    this.translateService.use(this.selectedLanguage.code);
  }

  switchLanguage(lang: Language): void {
    this.myTranslateService.setSelectedLanguage(lang.code);
    this.selectedLanguage = lang;

    this.translateService.use(this.selectedLanguage.code);
  }
}
