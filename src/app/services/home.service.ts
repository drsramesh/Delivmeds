import { Injectable } from '@angular/core';
import { Details } from '../Interface/details';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { environment } from '../../environments/environment';

@Injectable()
export class HomeService {
  details: any = [];

  constructor(private http: Http) { }

  getCompleteDetails() {
    return this.http.get('/showcase/resources/data/cars-small.json').
      toPromise()
      .then(res => <Details[]> res.json().data)
      .then(data => data);
    }
    getCompleteDetail(): Observable<Details> {
      return this.http.get(environment.host + '/Users', ).map(result => result.json());
  }
}
