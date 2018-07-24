import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Importing Third-party modules
import { tokenNotExpired } from 'angular2-jwt';


// Importing Application Services
import { TokenService } from './../services/token.service';
  import { UserService } from './../services/user.service';
import { environment } from './../../environments/environment';

@Injectable()
export class DelivMedsAuthService {

constructor(
  private _http: HttpClient,
  private _tokenService: TokenService,
  private _userService: UserService,
  private _router: Router
) { }

// sign in api call
signIn(params) {
//console.log(params);
return this._http.post(environment.host + 'pharmacy/login', params);
}

statusOrder(params){
return this._http.post(environment.host + 'order/pharmacy/status', params);
}

totalOrderPrice(params){
return this._http.post(environment.host + 'order/pharmacy', params);
}

// update token call checking for auth token if not will send refresh token
updateRefreshToken() {
const params = this._tokenService.getTokens();
let header = {};
if (params['refresh_token'] !== null) {
  header = {'refresh_token': localStorage.getItem('refresh_token')};
}
return this._http.post(environment.host + 'users/update_refresh_token', { }, { headers: header});
}

// Checking whether any user logged in or not
isAuthenticated() {
const params = this._tokenService.getTokens();
if (params['authentication_token'] !== null) {
   const promise = new Promise(
  (resolve, reject) => {
     resolve(true);
     this._router.navigate(["/orders"]);
  }
);
return promise;
} else {
  const promise = new Promise(
    (resolve, reject) => {
       resolve(false);
    }
  );
  return promise;

}

}


// Check for email availabilty in sign up
emailAvailability(params) {
return this._http.get(environment.host + 'users/email_availability', {params: params});
}

// Confirming email for login
confirmEmail(params) {
 console.log('email')
 console.log(params)
return this._http.get(environment.host + 'pharmacy/register/email_verify', {params:params});
}
// Signup method
signUp(params) {
const header = {'authentication_token': localStorage.getItem ('authentication_token')};
 console.log(params);   
return this._http.post(environment.host + 'pharmacy/register' ,params);
}

newUser(params) {
const header = {'authentication_token': localStorage.getItem ('authentication_token')};
 console.log(params);   
return this._http.post(environment.host + 'pharmacy/register/user' ,params);
}

//for updateddetails
updateDetails(profilepageObj) {
return this._http.post(environment.host + 'pharmacy/profile',  profilepageObj);
}

EdituserDetails(params) {
// const header = {'authentication_token': localStorage.getItem('authentication_token')};
console.log(JSON.stringify(params));   
return this._http.post(environment.host + 'pharmacy/update_basic_profile',  params);
}


// forgot password call
forgotPassword(params) {
return this._http.post(environment.host + 'users/forgot_password', params);
}
// Resetting password
resetPassword(params) {
return this._http.post(environment.host + 'users/reset_password', params);
}
// Logout, clear tokens and redirect to login page
logout() {
const header = {'authentication_token': localStorage.getItem ('authentication_token'),
'refresh_token': localStorage.getItem('refresh_token')};
this._http.post(environment.host + 'users/sign_out', { headers: header}).subscribe((res) => {
  this._tokenService.removeTokens();
  this._userService.destroyUser();
   this._router.navigate(['/login']);
});
}

// After session expired redirecting to login page
redirectTo() {
  this._tokenService.removeTokens();
  this._userService.destroyUser();
  this._router.navigate(['/login']);
}


}