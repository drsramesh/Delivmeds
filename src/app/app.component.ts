import { Component, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import 'rxjs/add/operator/pairwise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from  '../environments/environment';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//pub nub
import { PubNubAngular } from 'pubnub-angular2';
import { PubnubService } from './pubnub.service';
import {MessageService} from 'primeng/components/common/messageservice';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message;
  title = 'app';
  msgs = [];

  constructor(
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private router: Router,
    private http: HttpClient,
    public pubnub: PubNubAngular,
    private pb: PubnubService,
    private messageService: MessageService
    ) {
      this.toastr.setRootViewContainerRef(vcr);
      this.router.events.pairwise().subscribe((event) => {
      });
}

ngOnInit() {
  this.pb.init((message) => {
    console.log(message);
    this.msgs.push({severity: 'info', summary:message['message']['map']['orderId'], detail: message['message']['map']['message']});
    
  });

}

orderView(event){
  if(localStorage.getItem('authentication_token') !== null){ 
    this.router.navigate(['/order-view/'+ event['message']['summary']]);
    console.log(this.msgs)
    this.msgs.splice(this.msgs.indexOf(event),1);
    console.log(this.msgs);
  }
  else {
    // this.msgs.push({severity: 'info', summary: 'Info Message', detail:'You are logged out please login'});
    // this.msgs.push({severity: 'info', summary: 'Error', detail: 'your Email id is not verified'});
    this.msgs= [];
  this.router.navigate(['/login']);
  }
 
  
}


}
