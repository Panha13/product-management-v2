import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  template: `
    <div>
      <nz-input-group [nzSuffix]="suffixIconSearch">
        <input
          type="text"
          [(ngModel)]="searchValue"
          (ngModelChange)="onSearchValueChange($event)"
          nz-input
          placeholder="Search here..."
        />
      </nz-input-group>
      <ng-template #suffixIconSearch>
        <span style="font-size: 18px;" nz-icon nzType="search"></span>
      </ng-template>
    </div>
  `,
  styles: [
    `
      nz-input-group {
        border-radius: 10px;
        padding: 10px;
        width: 420px;
      }
    `,
  ],
})
export class SearchInputComponent {
  @Input() searchValue: string = '';
  @Output() searchValueChange = new EventEmitter<string>();

  onSearchValueChange(value: string): void {
    this.searchValueChange.emit(value);
  }
}
