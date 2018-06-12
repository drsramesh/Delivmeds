import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

@Injectable()
export class StateService {

  constructor(private http: Http) { }
  getCountries() {
    return this.http.get('showcase/resources/data/countries.json')
                .toPromise()
                .then(res => <any[]> res.json().data)
                .then(data => data);
}

}
