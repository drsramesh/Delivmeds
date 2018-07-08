import { Component, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import 'rxjs/add/operator/pairwise';
import { MessagingService } from './messaging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from  '../environments/environment';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message;
  title = 'app';
  // template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  userInformation : any = [];
 

  constructor(
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private router: Router,
    private msgService: MessagingService,
    private http: HttpClient
    ) {
      this.toastr.setRootViewContainerRef(vcr);
      this.router.events.pairwise().subscribe((event) => {
        // console.log(event);
      });
}

ngOnInit() {
  this.RegisteredDetailsService();
}

RegisteredDetailsService() {
  const header = {'authentication_token': localStorage.getItem('authentication_token')};
  console.log(header);
  console.log("auth" + localStorage.getItem ('authentication_token'));
  

  this.http.get(environment.host + 'pharmacy/profile' ).subscribe(data =>
  {
    console.log(JSON.stringify(data));
 this.userInformation = data;
  console.log(this.userInformation);

  });
}



}
