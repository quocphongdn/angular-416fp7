import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { groupBy } from '@progress/kendo-data-query';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  styles: [
    `
        .dropdown, kendo-multiselect { 
            width: 450px;
        }
        .block {
            margin-top: 45px;
        }
        `,
  ],
  template: `
        <div class="block">
            <h6>Countries (multiselect - grouping)</h6>
            <kendo-multiselect
                kendoMultiSelectSummaryTag
                [data]="countries"
                textField="name"
                valueField="name">
            </kendo-multiselect>
        </div>
        <br/>
        <br/>
        <br/>
        <div class="block">
            <h6>Countries (multiselecttree)</h6>
            <kendo-multiselecttree
            kendoMultiSelectTreeExpandable
            kendoMultiSelectTreeSummaryTag
            [data]="countries"
            textField="name"
            valueField="name"
            [hasChildren]="hasChildren"
            [fetchChildren]="fetchChildren"
            class="dropdown"
            >
                <ng-template kendoMultiSelectTreeGroupTagTemplate let-dataItems>
                    <span class="k-icon k-i-arrow-s"></span>
                    {{ dataItems.length }} item(s) selected
                </ng-template>
            </kendo-multiselecttree>
        </div>
   `,
})
export class AppComponent {
  public countries = [];
  constructor(private http: HttpClient) {
    this.http
      .get(
        'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json'
      )
      .subscribe((x: Array<any>) => {
        this.countries = groupBy(x, [{ field: 'region' }]);
        this.countries = this.countries
          .filter((c) => c.value != '')
          .map((c) => {
            c.name = c.value;
            return c;
          });
        console.log(this.countries);
      });
  }

  public fetchChildren(node: any): Observable<any[]> {
    return of(node.items);
  }

  public hasChildren(node: any): boolean {
    // checks if the parent node has children
    return node.items && node.items.length > 0;
  }
}
