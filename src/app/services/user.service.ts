import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BaseService} from "./base.service";
import { CustomersDropdown, PaginationResponse, User} from "../models";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService{
  getCustomers(request: any ): Observable<PaginationResponse<User>> {
    return this.get<any, PaginationResponse<User>>(`users`, request)
  }

  getCustomersDropdown(): Observable<User[]> {
    return this.get<any, User[]>(`users/dropdown`)
  }
  getCustomerById(id: number):Observable<User>{
    return this.get(`user/${id}`)
  }
  getCustomer(): Observable<PaginationResponse<CustomersDropdown>> {
    return this.get<any, PaginationResponse<CustomersDropdown>>(`users`)
  }

  deleteCustomer(id: number) {
    return this.delete(`users/${id}`)
  }

  create(postData: any): Observable<any> {
    return this.post(`users`, postData)
  }

  update(id: number, params: User): Observable<User> {
    return this.put<User>(`users/${id}`, params)
  }
}
