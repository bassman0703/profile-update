import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mockUserData = {
    firstName: 'davit',
    lastName: 'jmukhadze',
    email: 'davitijmukhadze@gmail.com',
    phone: '598088238',
    profilePicture: 'assets/img/user.png',
  };

  getUserProfile(): Observable<any> {
    return of(this.mockUserData).pipe(delay(500));
  }

  updateUserProfile(data: any): Observable<any> {
    console.log('Updated User Data:', data);
    return of({ message: 'Profile updated successfully' }).pipe(delay(500));
  }
}
