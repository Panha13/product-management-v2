import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService, Category } from './categories.service';
import { CategoryUiService } from './category-ui.service';
import { QueryParam } from 'src/app/helpers/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-categories',
  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <app-search-input
              [placeholder]="'Search categories here' | translate"
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
              {{ 'Add Category' | translate }}
            </button>
          </div>
        </div>
        <div nz-row class="flex-grow">
          <nz-table
            [nzData]="categories"
            nzTableLayout="fixed"
            nzShowPagination
            nzShowSizeChanger
            [nzFrontPagination]="false"
            [nzPageIndex]="param.pageIndex"
            [nzPageSize]="param.pageSize"
            [nzTotal]="totalCate"
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
              <tr *ngFor="let data of categories; let i = index">
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
                      (click)="uiService.showEdit(data.category_id || 0)"
                    >
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button
                      nz-button
                      nzType="default"
                      nzDanger
                      (click)="uiService.showDelete(data.category_id || 0)"
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
  styles: [``],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  constructor(
    private service: CategoriesService,
    public uiService: CategoryUiService,
    private message: NzMessageService
  ) {}

  categories: Category[] = [];
  totalCate: number = 0;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    searchQuery: '',
  };

  loading: boolean = false;
  private searchSubject = new Subject<string>();
  private refreshSub$!: Subscription;

  ngOnInit(): void {
    this.loadCate();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => this.loadCate());

    this.refreshSub$ = this.uiService.refresher.subscribe(() =>
      this.loadCate()
    );
  }

  loadCate(): void {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.categories = response.data;
          this.totalCate = response.total;
          this.loading = false;
        }, 250);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.message.error('Failed to load categories.');
        this.loading = false;
      },
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize } = params;

    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.loadCate();
  }

  onSearch(query: string): void {
    this.param.pageIndex = 1;
    this.param.searchQuery = query;
    this.loadCate();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
