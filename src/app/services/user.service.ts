// import {Injectable} from '@angular/core';
// import {delay, Observable, of} from "rxjs";
// import {BaseService} from "./base.service";
// import {PaginationResponse} from "../models/page-options";
// import {User} from "../models/user";
//
// @Injectable({
//   providedIn: 'root'
// })
//
//
// export class UserService extends BaseService{
//
//   private userProfile = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@example.com',
//     phoneNumber: '1234567890',
//   };
//
//   getUserProfile(): Observable<any> {
//     return of(this.userProfile).pipe(delay(500));
//   }
//
//   updateUserProfile(profileData: any): Observable<any> {
//     this.userProfile = { ...this.userProfile, ...profileData };
//     return of(this.userProfile).pipe(delay(500));
//   }
//
//   getCustomers(request: any ): Observable<PaginationResponse<User>> {
//     return this.get<any, PaginationResponse<User>>(`users`, request)
//   }
//
//   getCustomersDropdown(): Observable<User[]> {
//     return this.get<any, User[]>(`users/dropdown`)
//   }
//   getCustomerById(id: number):Observable<User>{
//     return this.get(`user/${id}`)
//   }
//
//   deleteCustomer(id: number) {
//     return this.delete(`users/${id}`)
//   }
//
//   create(postData: any): Observable<any> {
//     return this.post(`users`, postData)
//   }
//
//   update(id: number, params: User): Observable<User> {
//     return this.put<User>(`users/${id}`, params)
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private mockUserData = {
    firstName: 'Davit',
    lastName: 'Jmukhadze',
    email: 'davitijmukhadze@gmail.com',
    phone: '598088238',
    profileImage: ''
  };

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return of(this.mockUserData).pipe(delay(1000));
  }

  updateUserProfile(data: FormData): Observable<any> {
    console.log('Updated Data:', data);
    return of({ success: true }).pipe(delay(1000));
  }
}
