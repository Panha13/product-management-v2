import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <nz-result
      nzStatus="404"
      nzTitle="404"
      nzSubTitle="Sorry, the page you visited does not exist."
      style="padding: 20px ;"
    >
      <div nz-result-extra>
        <button nz-button nzType="primary" routerLink="/dashboard">
          Back Home
        </button>
      </div>
    </nz-result>
  `,
  styles: [
    `
      ::ng-deep .ant-result.anticon svg {
        width: 32px; /* Adjust width as needed */
        height: 32px; /* Adjust height as needed */
      }
    `,
  ],
})
export class PageNotFoundComponent {}
