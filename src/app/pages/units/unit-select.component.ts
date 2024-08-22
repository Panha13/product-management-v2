import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unit, UnitsService } from './units.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-unit-select',
  template: `
    <nz-select
      nzShowSearch
      nzAllowClear
      [nzPlaceHolder]="placeholder | translate"
      [nzDisabled]="isDisabled"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onChangeUnit($event)"
      [nzLoading]="loading"
    >
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <span nz-icon nzType="loading" class="loading-icon"></span>
        Loading...
      </nz-option>
      <ng-container *ngFor="let unit of units">
        <nz-option [nzValue]="unit.unit_id" [nzLabel]="unit.name"></nz-option>
      </ng-container>
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
  units: Unit[] = [];
  selectedValue: number | null = null;
  isDisabled: boolean = false;
  loading: boolean = false;
  onChange(value: any) {}
  onTouched() {}

  ngOnInit(): void {
    this.loadUnits();
  }
  private loadUnits(): void {
    this.loading = true;
    this.unitService.getUnits().subscribe({
      next: (unitData) => {
        this.units = unitData;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.notify.error('Error', 'Failed to load units.');
        this.loading = false;
      },
    });
  }

  onChangeUnit(unitId: number): void {
    this.selectedValue = unitId;
    this.onChange(unitId);
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
