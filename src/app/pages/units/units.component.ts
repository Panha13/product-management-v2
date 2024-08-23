import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unit, UnitsService } from './units.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UnitUiService } from './unit-ui.service';

@Component({
  selector: 'app-units',
  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <app-search-input
              [placeholder]="'Search units here' | translate"
              [(searchQuery)]="searchQuery"
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
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            [nzTotal]="totalUnit"
            (nzPageIndexChange)="onPageIndexChange($event)"
            (nzPageSizeChange)="onPageSizeChange($event)"
            [nzLoading]="loading"
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
                  {{ (this.pageIndex - 1) * this.pageSize + i + 1 }}
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
  pageIndex: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private refreshSub$!: Subscription;

  constructor(
    private service: UnitsService,
    public uiService: UnitUiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUnit();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.loadUnit();
    });

    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.loadUnit();
    });
  }

  loadUnit(): void {
    this.loading = true;
    this.service
      .getUnits(this.pageIndex, this.pageSize, this.searchQuery)
      .subscribe({
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

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadUnit();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // Reset page index to 1 when page size changes

    this.loadUnit();
  }
  onSearch(query: string): void {
    this.pageIndex = 1; // Reset to first page on search
    this.searchQuery = query;
    this.loadUnit();
  }
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch(this.searchQuery);
    }
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
