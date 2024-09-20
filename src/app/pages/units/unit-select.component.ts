import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unit, UnitsService } from './units.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QueryParam } from 'src/app/helpers/base-api.service';

@Component({
  selector: 'app-unit-select',
  template: `
    <nz-select
      nzShowSearch
      [nzPlaceHolder]="placeholder | translate"
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="onSearch($event)"
      [nzDisabled]="isDisabled"
    >
      <nz-option
        *ngIf="showAllOption"
        [nzValue]="0"
        [nzLabel]="'All Units' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let unit of units"
        nzCustomContent
        [nzValue]="unit.id"
        [nzLabel]="unit.name!"
      >
        <span>{{ unit.name }}</span>
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ 'Loading' | translate }}
      </nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UnitSelectComponent),
      multi: true,
    },
  ],
})
export class UnitSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private unitService: UnitsService,
    private notify: NzNotificationService
  ) {}

  @Input() placeholder: string = 'Select Unit';
  @Input() showAllOption: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();

  selectedValue: number = 0;
  isDisabled: boolean = false;
  loading: boolean = false;
  units: Unit[] = [];
  searchText = '';

  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };

  onChange(_value: any) {}
  onTouched() {}

  ngOnInit(): void {
    if (this.showAllOption) this.selectedValue = 0;
  }

  search(): void {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'name', operator: 'contains', value: this.searchText },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.units = [];
    }
    this.unitService.search(this.param).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.units = response.results;
      },
      error: () => {
        this.loading = false;
        this.notify.error('Error', 'Failed to load units.');
      },
    });
  }

  onSearch(value: string): void {
    this.searchText = value;
    this.param.pageIndex = 1;
    this.search();
  }

  onModalChange(): void {
    this.valueChanged.emit(this.selectedValue);
    this.onChange(this.selectedValue);
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
