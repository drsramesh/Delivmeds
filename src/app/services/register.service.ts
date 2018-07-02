import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { User } from '../Interface/createUser';

@Injectable()
export class RegisterService {

  constructor(private http: Http) { }

  createUserList() {
    return this.http.get('/showcase/resources/data/cars-small.json')
    .toPromise()
    .then(res => <User[]> res.json().data)
    .then(data => data);
  }

}
