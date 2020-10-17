import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { REQUEST_API } from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('jwt'));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
      return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
      return this.http.post<any>(`${REQUEST_API}/auth/login`, { email, password })
          .pipe(map(token => {
              // login successful if there's a jwt token in the response
              if (token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('jwt', token.access_token);
                  this.currentUserSubject.next(token.access_token);
              }

              return token;
          }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('jwt');
      this.currentUserSubject.next(null);
  }
}
