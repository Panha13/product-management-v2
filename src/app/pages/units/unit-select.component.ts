import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unit, UnitsService } from './units.service';

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
    >
      <nz-option
        *ngFor="let unit of units"
        [nzLabel]="unit.name"
        [nzValue]="unit.unit_id"
      ></nz-option>
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
  constructor(private unitService: UnitsService) {}

  @Input() placeholder: string = 'Select Unit';
  units: Unit[] = [];
  selectedValue: number | null = null;
  isDisabled: boolean = false;
  onChange(value: any) {}
  onTouched() {}

  ngOnInit(): void {
    this.loadUnits();
  }
  private loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (unitData) => (this.units = unitData),
      error: (error) => {
        console.error('Failed to load units:', error);
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
