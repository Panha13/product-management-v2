import { Component } from '@angular/core';

@Component({
  selector: 'app-units',
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
        >
          <div nz-row nzAlign="middle"></div>

          <div nz-row style=" flex-grow: 1; overflow: auto;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class UnitsComponent {}
