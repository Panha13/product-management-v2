import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private storageKeyPageIndex = 'pageIndex';
  private storageKeyPageSize = 'pageSize';

  getPageIndex(): number {
    const savedPageIndex = sessionStorage.getItem(this.storageKeyPageIndex);
    return savedPageIndex ? parseInt(savedPageIndex, 10) : 1;
  }

  setPageIndex(pageIndex: number): void {
    sessionStorage.setItem(this.storageKeyPageIndex, pageIndex.toString());
  }

  getPageSize(): number {
    const savedPageSize = sessionStorage.getItem(this.storageKeyPageSize);
    return savedPageSize ? parseInt(savedPageSize, 10) : 10;
  }

  setPageSize(pageSize: number): void {
    sessionStorage.setItem(this.storageKeyPageSize, pageSize.toString());
  }

  clearPaginationState(): void {
    sessionStorage.removeItem(this.storageKeyPageIndex);
    sessionStorage.removeItem(this.storageKeyPageSize);
  }
}
