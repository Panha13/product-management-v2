import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      nz-button
      [nzType]="type"
      [nzSize]="size"
      nzGhost="ghost"
      [routerLink]="routerLink"
    >
      <span nz-icon [nzType]="iconType"></span>
      {{ label }}
    </button>
  `,
  styles: [],
})
export class ButtonComponent implements OnInit {
  @Input() label: string = 'Button'; // Default label
  @Input() type: 'primary' | 'default' | 'dashed' = 'primary'; // Default type
  @Input() ghost: boolean = true;
  @Input() size: 'small' | 'large' | 'default' = 'large'; // Default size
  @Input() routerLink: string | any[] = '/'; // Default router link

  // Optional icon type input
  @Input() iconType: string = 'plus'; // Default icon type

  constructor() {}

  ngOnInit() {}
}
