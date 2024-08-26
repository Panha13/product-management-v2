import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoriesService, Category } from './categories.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QueryParam } from 'src/app/helpers/base-api.service';

@Component({
  selector: 'app-category-select',
  template: `
    <nz-select
      nzShowSearch
      nzAllowClear
      [nzPlaceHolder]="placeholder | translate"
      [nzDisabled]="isDisabled"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onChangeCate($event)"
      [nzLoading]="loading"
    >
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <span nz-icon nzType="loading" class="loading-icon"></span>
        Loading...
      </nz-option>
      <ng-container *ngFor="let category of categories">
        <nz-option
          [nzValue]="category.category_id"
          [nzLabel]="category.name!"
        ></nz-option>
      </ng-container>
    </nz-select>
  `,
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
  categories: Category[] = [];
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    searchQuery: '',
  };
  selectedValue: number | null = null;
  isDisabled: boolean = false;
  loading: boolean = false;

  onChange(value: any) {}
  onTouched() {}

  ngOnInit(): void {
    this.loadCate();
  }

  loadCate(): void {
    this.loading = true;
    this.categoryService.getAll(this.param).subscribe({
      next: (ressult) => {
        // console.log(ressult.data);
        this.categories = ressult.data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.notify.error('Error', 'Failed to load categories.');
        this.loading = false;
      },
    });
  }

  onChangeCate(categoryId: number): void {
    this.selectedValue = categoryId;
    this.onChange(categoryId);
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    console.log('hit');
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
