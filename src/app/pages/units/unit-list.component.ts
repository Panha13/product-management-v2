import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unit, UnitsService } from './units.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
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
            <app-search-input
              [placeholder]="'Search units here' | translate"
              [(searchQuery)]="param.searchQuery"
              (search)="onSearch($event)"
            ></app-search-input>

            <button
              nz-button
              nzType="primary"
              nzSize="large"
              nzGhost
              style="border-radius:10px;"
              (click)="uiService.showAdd()"
            >
              <span nz-icon nzType="plus"></span>
              {{ 'Add Unit' | translate }}
            </button>
          </div>
        </div>
        <div nz-row class="flex-grow">
          <nz-table
            [nzData]="units"
            nzTableLayout="fixed"
            nzShowPagination
            nzShowSizeChanger
            [nzFrontPagination]="false"
            [nzPageIndex]="param.pageIndex"
            [nzPageSize]="param.pageSize"
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
                  {{ (this.param.pageIndex - 1) * this.param.pageSize + i + 1 }}
                </td>
                <td class="font-semibold">{{ data.name }}</td>

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
export class UnitsComponent implements OnInit, OnDestroy {
  units: Unit[] = [];
  totalUnit: number = 0;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    searchQuery: '',
  };
  loading: boolean = false;
  private searchSubject = new Subject<string>();
  private refreshSub$!: Subscription;

  constructor(
    private service: UnitsService,
    public uiService: UnitUiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUnit();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => this.loadUnit());

    this.refreshSub$ = this.uiService.refresher.subscribe(() =>
      this.loadUnit()
    );
  }

  loadUnit(): void {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.units = response.data;
          this.totalUnit = response.total;
          this.loading = false;
        }, 250);
      },
      error: (error) => {
        console.error('Error fetching units:', error);
        this.message.error('Failed to load units.');
        this.loading = false;
      },
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize } = params;

    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.loadUnit();
  }

  onSearch(query: string): void {
    this.param.pageIndex = 1;
    this.param.searchQuery = query;
    this.loadUnit();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
