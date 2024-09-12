import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoriesService, Category } from './categories.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QueryParam, QueryParam1 } from 'src/app/helpers/base-api.service';

@Component({
  selector: 'app-category-select',
  template: `
    <nz-select
      nzShowSearch
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
      [nzDisabled]="isDisabled"
      style="width:100%"
    >
      <nz-option
        *ngIf="showAllOption"
        [nzValue]="0"
        [nzLabel]="'All Categories' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let category of categories"
        nzCustomContent
        [nzValue]="category.category_id"
        [nzLabel]="category.name!"
      >
        <span>{{ category.name }}</span>
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ 'Loading' | translate }}
      </nz-option>
    </nz-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelectComponent),
      multi: true,
    },
  ],
})
export class CategorySelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private categoryService: CategoriesService,
    private notify: NzNotificationService
  ) {}

  @Input() placeholder: string = 'Select category';
  @Input() showAllOption!: boolean;
  @Output() valueChanged = new EventEmitter<any>();
  selectedValue: number = 0;
  isDisabled: boolean = false;
  loading: boolean = false;
  value: any = '';
  searchText = '';
  categories: Category[] = [];
  param: QueryParam1 = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };

  onChange(value: any) {}
  onTouched() {}

  ngOnInit(): void {
    if (this.showAllOption) this.selectedValue = 0;
  }

  search() {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'name', operator: 'contains', value: this.searchText },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.categories = [];
    }
    this.categoryService.search(this.param).subscribe((response: any) => {
      this.loading = false;
      this.categories = response.results;
    });
  }

  onModalChange() {
    this.valueChanged.emit(this.selectedValue);
  }
  writeValue(value: any): void {
    this.selectedValue = value;
    this.search();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
