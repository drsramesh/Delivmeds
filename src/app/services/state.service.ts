import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import {  environment } from '.././../environments/environment'
import {  Response, Headers, RequestOptions } from '@angular/http';



@Injectable()
export class StateService {

  constructor(private http: Http) { }
  getCountries() {
    // const header = {'authentication_token': localStorage.getItem('authentication_token')};
    // console.log(header);
    // console.log("auth" + localStorage.getItem ('authentication_token'));
   
    return this.http. get(environment.host + 'zipcodes/get_serviceable/501' )
                .toPromise()
                .then(res => <any[]> res.json().data)
                
                .then(data => {console.log(data);
                });
}

}
