import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoriesService } from './categories.service';
import { Category } from './category';

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
    >
      <nz-option
        *ngFor="let category of categories"
        [nzLabel]="category.name"
        [nzValue]="category.category_id"
      ></nz-option>
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
  constructor(private categoryService: CategoriesService) {}

  @Input() placeholder: string = 'Select category';
  categories: Category[] = [];
  selectedValue: number | null = null;
  isDisabled: boolean = false;
  onChange(value: any) {}
  onTouched() {}

  ngOnInit(): void {
    this.loadCate();
  }

  loadCate(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => console.error('Failed to load categories', error),
    });
  }

  onChangeCate(categoryId: number): void {
    this.selectedValue = categoryId;
    this.onChange(categoryId);
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
