import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  template: `
    <nz-input-group [nzSuffix]="suffixIconSearch">
      <input
        type="text"
        nz-input
        [attr.placeholder]="placeholder"
        [(ngModel)]="value"
        (keyup.enter)="filterTextChanged()"
      />
    </nz-input-group>
    <ng-template #suffixIconSearch>
      <span style="font-size: 18px;" nz-icon nzType="search"></span>
    </ng-template>
  `,
  styles: [
    `
      nz-input-group {
        border-radius: 10px;
        padding: 8px;
        width: 420px;
      }
    `,
  ],
})
export class FilterInputComponent {
  @Input() placeholder: string = 'Search...';
  @Input() value: string = '';
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();

  filterTextChanged(): void {
    this.filterChanged.emit(this.value);
  }
}
