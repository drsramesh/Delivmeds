
import { Injectable } from '@angular/core';


@Injectable()
export class TokenService {

  constructor() {}

  // store tokens once sign in
  storeTokens(authentication_token) {
      localStorage.setItem('authentication_token', authentication_token);
    //   console.log(authentication_token);
    //  var auth =  auth_token as string;
    //   console.log(auth)
     //  localStorage.setItem('refresh_token', refresh_token);
  }

  getTokens() {
      return {'authentication_token': localStorage.getItem('authentication_token'), 'refresh_token': localStorage.getItem('refresh_token')};
  }

  getAuthenticationToken() {
      return localStorage.getItem('authentication_token');
  }

  getRefreshToken() {
      return localStorage.getItem('refresh_token');
  }

  removeTokens() {
    localStorage.clear();
  }



}


