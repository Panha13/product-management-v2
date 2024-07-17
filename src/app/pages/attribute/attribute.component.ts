import { Component } from '@angular/core';

@Component({
  selector: 'app-attribute',
  template: `
    <div
      class="inner-content"
      style="display: flex; align-items: center; justify-content: center;"
    >
      <nz-result [nzIcon]="'smile-twotone'" [nzTitle]="'Nothing is here yet!'">
        <div nz-result-extra>
          <button nz-button nzType="primary">Go to Next Page</button>
        </div>
      </nz-result>
    </div>
  `,
  styles: [],
})
export class AttributeComponent {
  searchValue = '';
  attributeList: [] = [];
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  onSearchInput(searchValue: string): void {
    this.searchValue = searchValue;
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }
}
