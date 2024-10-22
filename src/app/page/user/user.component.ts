import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {map, Observable, switchMap, tap} from "rxjs";
import {PaginationResponse, User} from "../../models";
import {UserService} from "../../services";
import {AsyncPipe, CommonModule, DatePipe} from "@angular/common";
import {NzTableModule, NzTableQueryParams} from "ng-zorro-antd/table";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {HeaderComponent} from "../../shared/header/header.component";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {NzModalService} from "ng-zorro-antd/modal";
import {AddOrEditCustomersComponent} from "./add-or-edit-customers/add-or-edit-customers.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {columns} from "./customers-columns";
import {NzSpaceComponent, NzSpaceItemDirective} from "ng-zorro-antd/space";


@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: 'customers.component.html',
  imports: [
    CommonModule,
    AsyncPipe,
    RouterModule,
    NzTableModule,
    NzDividerComponent,
    HeaderComponent,
    NzPaginationComponent,
    AddOrEditCustomersComponent,
    FormsModule,
    NzInputModule,
    NzEmptyComponent,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzSpaceComponent,
    NzSpaceItemDirective
  ],
  providers: [NzModalService, DatePipe],
  styleUrl: 'customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent {
  modal: NzModalService = inject(NzModalService)
  customerService: UserService = inject(UserService)
  route: ActivatedRoute = inject(ActivatedRoute)
  router: Router = inject(Router)
  datepipe: DatePipe = inject(DatePipe)

  page = 1
  pageSize = 10
  total = 0
  sortBy = 'createdAt';
  order: 'ASC' | 'DESC' = 'DESC';
  search: string | null = null;
  searchQuery: any = null;

  advancedFilter = false;

  columns = columns

  searchForm: FormGroup = new FormGroup({
    clientNumber: new FormControl(null),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    phoneNumber: new FormControl(null),
    personalNumber: new FormControl(null),
    legalAddress: new FormControl(null),
    actualAddress: new FormControl(null),
  })

  customers$: Observable<PaginationResponse<User>> = this.route.queryParams.pipe(
    tap((route) => {
      this.page = route['page'] || this.page;
      this.pageSize = route['pageSize'] || this.pageSize;
      this.sortBy = route['orderBy'] || this.sortBy;
      this.order = route['order'] || this.order;
      this.searchQuery = route['searchQuery'] || this.searchQuery;
    }),
    switchMap((params) => {
      return this.customerService
        .getCustomers(params).pipe(
          map((res: PaginationResponse<User>) => {
            return {
              ...res,
              data: res.data.map((item: User) => ({
                ...item,
                legalAddress: `${item.legalCountry}, ${item.legalCity}, ${item.legalAddress}`,
                actualAddress: `${item.actualCountry}, ${item.actualCity}, ${item.actualAddress}`,
                createdAt: this.datepipe.transform(item.createdAt, 'dd/MM/yyyy HH:mm'),
              })) as User[]
            }
          }),
          tap(
            (res) => {
              this.total = res.total || 0;
            }
          )
        )
    })
  )


  paginationChange(
    params: NzTableQueryParams
  ) {
    const {pageSize, pageIndex, sort} = params;
    const currentSort = sort.find(item => item.value !== null);
    if (currentSort) {
      this.sortBy = (currentSort && currentSort.key);
      this.order = (currentSort && currentSort.value) === 'ascend' ? 'ASC' : 'DESC';
    }
    this.routeChange({
      page: pageIndex,
      pageSize: pageSize,
      sortBy: this.sortBy,
      order: this.order
    })
  }

  filter(value: any) {
    if (value) {
      this.searchQuery = value;
    } else {
      this.searchQuery = null;
    }
    this.routeChange({
      searchQuery: this.searchQuery,
      page: 1
    })
  }

  advancedSearch() {
    if (this.searchForm.value) {
      this.routeChange({...this.searchForm.value, page: 1})
    }
  }

  resetSearch() {
    this.searchForm.reset();
    this.routeChange({...this.searchForm.value, page: 1})
  }

  add(id?: number) {
    this.modal.create({
      nzTitle: 'დამატება/რედაქტირება',
      nzContent: AddOrEditCustomersComponent,
      nzWidth: '750px',
      nzData: {
        account: id && this.getCustomerById(id)
      },
      nzOnOk: () => {
        this.router.navigate(['/customers']).then()
      }
    });
  }

  getCustomerById(id: number): Observable<User> {
    return this.customerService.getCustomerById(id)
  }

  delete(id: number) {
    this.customerService.deleteCustomer(id).subscribe(res => {
      this.router.navigate(['/customers']).then()
    })
  }

  routeChange(params: any) {
    this.router.navigate(['.'], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        ...params
      },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    }).then()
  }

}
