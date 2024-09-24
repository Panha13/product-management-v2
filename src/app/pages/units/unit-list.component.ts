import { Component, OnDestroy } from '@angular/core';
import { Unit, UnitsService } from './units.service';
import { Subscription } from 'rxjs';
import { UnitUiService } from './unit-ui.service';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';

@Component({
  selector: 'app-units',
  template: `
    <div class="flex-column-gap">
      <div class="flex-row-gap">
        <div class="full-width-row">
          <app-filter-input
            [placeholder]="'Search units here' | translate"
            (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
          ></app-filter-input>
          <app-button-add-item
            [label]="'Add Unit'"
            (clicked)="uiService.showAdd()"
          ></app-button-add-item>
        </div>
      </div>
      <div nz-row class="flex-grow">
        <nz-table
          [nzData]="lists"
          nzTableLayout="fixed"
          nzShowPagination
          nzShowSizeChanger
          [nzFrontPagination]="false"
          [nzPageIndex]="param.pageIndex || 0"
          [nzPageSize]="param.pageSize || 0"
          [nzTotal]="total"
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
            <tr *ngFor="let data of lists; let i = index">
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
                    (click)="uiService.showEdit(data.id || 0)"
                  >
                    <span nz-icon nzType="edit"></span>
                  </button>
                  <button
                    nz-button
                    nzType="default"
                    nzDanger
                    (click)="uiService.showDelete(data.id || 0)"
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
  `,
  styles: [],
})
export class UnitListComponent
  extends BaseListComponent<Unit>
  implements OnDestroy
{
  constructor(service: UnitsService, public uiService: UnitUiService) {
    super(service);
  }

  override param: QueryParam = {
    ...this.param,
    sort: 'id-',
  };

  private refreshSub$!: Subscription;

  override ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
    this.search();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
