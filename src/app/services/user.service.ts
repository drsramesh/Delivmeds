import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/observable';


@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) { }

// service to make a post request to create user
  createUser(reqBody: any): Observable <any> {
    console.log(reqBody)
    return this.httpClient.post(environment.host + 'create_user', reqBody);
  
  }

  setUser(reqBody: any): Observable <any> {
    return this.httpClient.post(environment.host + 'set_user', reqBody);
  }
   // service method to delete user record
   deleteUser(userId, siteId) {
    return this.httpClient.delete(environment.host + 'delete_user', { params: { id: userId, site_id: siteId}});
  }
// service to get user details based on id passed to it
getUserDetails(userId: string) {
  return this.httpClient.get(environment.host + 'pharmacy/profile', { params: { id: userId}});
}

InsuranceDetails(params){
  return this.httpClient.post(environment.host + '/pharmacy/insurance_providers', params );
}
  logout( ) {
    return this.httpClient.post(environment.host + 'logout', {});
   }

   destroyUser() {
    return this.httpClient.delete(environment.host + 'logout', {});
   }
}
