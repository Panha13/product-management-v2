import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  template: `
    <div nz-col nzSpan="8">
      <nz-input-group [nzSuffix]="suffixIconSearch">
        <input
          id="search"
          type="text"
          nz-input
          [attr.placeholder]="placeholder"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearchQueryChange($event)"
          (keydown)="handleKeyDown($event)"
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
        padding: 8px;
        width: 420px;
      }
    `,
  ],
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Search...';
  @Input() searchQuery: string = '';
  @Output() searchQueryChange: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search.emit(this.searchQuery);
    }
  }

  onSearchQueryChange(value: string): void {
    this.searchQuery = value;
    this.searchQueryChange.emit(this.searchQuery);
  }
}
