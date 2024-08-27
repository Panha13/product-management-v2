import { Component, OnInit } from '@angular/core';

export interface Language {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
