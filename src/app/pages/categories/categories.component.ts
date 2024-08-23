import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService, Category } from './categories.service';
import { CategoryUiService } from './category-ui.service';

@Component({
  selector: 'app-categories',
  template: `
    <div class="inner-content">
      <div class="flex-column-gap">
        <div class="flex-row-gap">
          <div class="full-width-row">
            <app-search-input
              [placeholder]="'Search categories here' | translate"
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
            [nzPageIndex]="pageIndex"
            [nzPageSize]="pageSize"
            [nzTotal]="totalCate"
            (nzPageIndexChange)="onPageIndexChange($event)"
            (nzPageSizeChange)="onPageSizeChange($event)"
            [nzLoading]="loading"
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
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  totalCate: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private refreshSub$!: Subscription;

  constructor(
    private service: CategoriesService,
    public uiService: CategoryUiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadCate();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.loadCate();
    });

    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.loadCate();
    });
  }

  loadCate(): void {
    this.loading = true;
    this.service
      .getCategories(this.pageIndex, this.pageSize, this.searchQuery)
      .subscribe({
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

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadCate();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // Reset page index to 1 when page size changes

    this.loadCate();
  }
  onSearch(query: string): void {
    this.pageIndex = 1; // Reset to first page on search
    this.searchQuery = query;
    this.loadCate();
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
