import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonType, NzButtonSize } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-button-add-item',
  template: `
    <button
      nz-button
      [nzType]="type"
      [nzSize]="size"
      [nzGhost]="ghost"
      (click)="onClick()"
      class="button"
    >
      <span nz-icon [nzType]="iconType"></span>
      {{ label | translate }}
    </button>
  `,
  styles: [
    `
      .button {
        border-radius: 10px;
        font-size: 14px;
      }
    `,
  ],
})
export class ButtonAddItemComponent {
  @Input() label: string = 'Add';
  @Input() iconType: string = 'plus';
  @Input() type: NzButtonType = 'primary';
  @Input() size: NzButtonSize = 'large';
  @Input() ghost: boolean = true;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
