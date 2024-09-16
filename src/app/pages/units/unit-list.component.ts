import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unit, UnitsService } from './units.service';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UnitUiService } from './unit-ui.service';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-units',
  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <app-filter-input
              [placeholder]="'Search units here' | translate"
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>
            <app-button-add-item
              [label]="'Add Unit'"
              (clicked)="uiService.showAdd()"
            ></app-button-add-item>
          </div>
        </div>
        <div nz-row class="flex-grow">
          <nz-table
            [nzData]="units"
            nzTableLayout="fixed"
            nzShowPagination
            nzShowSizeChanger
            [nzFrontPagination]="false"
            [nzPageIndex]="param.pageIndex || 0"
            [nzPageSize]="param.pageSize || 0"
            [nzTotal]="totalUnit"
            [nzLoading]="loading"
            (nzQueryParams)="onQueryParamsChange($event)"
          >
            <thead>
              <tr class="table-header">
                <th nzWidth="10%">#</th>
                <th nzWidth="30%">{{ 'Unit Name' | translate }}</th>
                <th nzWidth="40%">{{ 'Description' | translate }}</th>
                <th nzWidth="20%" [nzAlign]="'center'">
                  {{ 'Action' | translate }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of units; let i = index">
                <td nzEllipsis>
                  {{
                    ((this.param.pageIndex || 1) - 1) *
                      (this.param.pageSize || 10) +
                      i +
                      1
                  }}
                </td>
                <td>{{ data.name }}</td>

                <td nzEllipsis>
                  {{ data.description ? data.description : '—' }}
                </td>

                <td>
                  <nz-row class="action-buttons">
                    <button
                      nz-button
                      nzType="primary"
                      nzGhost
                      (click)="uiService.showEdit(data.unit_id || 0)"
                    >
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button
                      nz-button
                      nzType="default"
                      nzDanger
                      (click)="uiService.showDelete(data.unit_id || 0)"
                    >
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </nz-row>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class UnitListComponent implements OnInit, OnDestroy {
  constructor(
    private service: UnitsService,
    public uiService: UnitUiService,
    private message: NzMessageService
  ) {}

  units: Unit[] = [];
  totalUnit: number = 0;

  searchText: string = '';
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    filters: '',
  };
  loading: boolean = false;
  private refreshSub$!: Subscription;

  ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
    this.search();
  }

  search(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'name', operator: 'contains', value: this.searchText },
      ];
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.units = response.results;
          this.totalUnit = response.params.total;
          this.loading = false;
        },
        error: () => {
          this.message.error('Failed to load products.');
          this.loading = false;
        },
      });
    }, 50);
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize, sort } = params;
    const sortFound = sort.find((x) => x.value);
    this.param.sort =
      (sortFound?.key ?? 'unit_id-') +
      (sortFound?.value === 'descend' ? '-' : '');
    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.search();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
