import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseApiService, QueryParam } from 'src/app/helpers/base-api.service';

@Component({
  template: ``,
})
export class BaseListComponent<T> implements OnInit {
  constructor(protected service: BaseApiService<any>) {}

  lists: T[] = [];
  total: number = 0;
  searchText: String = '';
  loading: boolean = false;

  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    filters: '',
    sort: '',
  };

  ngOnInit(): void {
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
          this.lists = response.results;
          this.total = response.params.total;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 50);
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize, sort } = params;
    const sortFound = sort.find((x) => x.value);
    this.param.sort =
      (sortFound?.key ?? this.param.sort) +
      (sortFound?.value === 'descend' ? '-' : '');
    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.search();
  }
}
