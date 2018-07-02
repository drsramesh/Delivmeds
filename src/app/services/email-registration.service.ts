import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import 'rxjs/Rx';

@Injectable()
export class EmailRegistrationService {

  constructor(private http: Http) { }

  isEmailRegisterd(email: string) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/api/v1/isEmailRegisterd', JSON.stringify({ email: email }), { headers: headers })
        .map((response: Response) => response.json())
        .catch(this.handleError);
}

private handleError(error: any) {
    console.log(error);
    return Observable.throw(error.json());
    ;
}

}
