import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  get token(): string | null {
    // @ts-ignore
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return <string>localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // TODO: нормально разобраться с типами

  private setToken(resp: FbAuthResponse | null) {
    if (resp && resp.expiresIn && resp.idToken) {
      const expDate = new Date(new Date().getTime() + +resp.expiresIn * 1000);
      localStorage.setItem('fb-token', resp.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
