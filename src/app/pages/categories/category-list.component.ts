import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService, Category } from './categories.service';
import { CategoryUiService } from './category-ui.service';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';

@Component({
  selector: 'app-categories',
  template: `
    <div class="flex-column-gap">
      <div class="flex-row-gap">
        <div class="full-width-row">
          <app-filter-input
            [placeholder]="'Search categories here' | translate"
            (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
          ></app-filter-input>
          <app-button-add-item
            [label]="'Add Category'"
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
              <th nzWidth="30%">{{ 'Category Name' | translate }}</th>
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
  styles: [``],
})
export class CategoryListComponent
  extends BaseListComponent<Category>
  implements OnDestroy
{
  constructor(service: CategoriesService, public uiService: CategoryUiService) {
    super(service);
  }

  override param: QueryParam = {
    ...this.param,
    sort: 'id-',
  };

  private refreshSub$!: Subscription;

  override ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
