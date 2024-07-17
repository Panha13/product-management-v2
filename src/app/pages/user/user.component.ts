import { Component, OnInit } from '@angular/core';

import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user',
  template: `
    <div class="inner-content">
      <div
        style="display: flex; flex-direction: column;  gap: 15px; height: 100%; "
      >
        <div
          nz-row
          nzJustify="space-between"
          nzAlign="middle"
          style="flex-shrink: 0;"
        ></div>

        <div nz-row style=" flex-grow: 1; overflow: auto;"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-image > img {
        border-radius: 12px;
        overflow: hidden;
        width: 50px;
        height: 100%;
        object-fit: cover;
      }

      .user-info,
      h4,
      p {
        margin: 0;
      }

      .user-info > h4 {
        font-weight: 700;
      }
      .user-info > p {
        color: #666;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
