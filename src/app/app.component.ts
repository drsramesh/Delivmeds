import { Component, ViewContainerRef, Output} from '@angular/core';
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
import { EventEmitter } from 'events';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message;
  title = 'app';
  msgs = [];
  userInformation = [];
  duplicateAlerts =[];
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
      console.log("App Component")
      console.log(message);
      this.msgs.push({severity: 'info', summary:message['message']['map']['orderId'], detail: message['message']['map']['message'],isRoute:true,status:message['message']['map']['status']});
      console.log(this.msgs)
           this.msgs.forEach((value,index)=>{
            console.log(index);
            console.log(value)
            if(value.status==1){
            }else{
                setTimeout(()=>{
             this.msgs.splice(index,1);
           },7000)
  
            }
             
          })
       
    });


}

orderView(event){
    if(localStorage.getItem('authentication_token') !== null){ 
      if(event.message.hasOwnProperty("isRoute")){
        if(event.message.isRoute == true){
          this.router.navigate(['/order-view/'+ event['message']['summary']]);
          this.msgs.splice(this.msgs.indexOf(event),1);
        }
      }

      } 
      // else if(event.message['message']['map']['orderId'] ) {
      //   setTimeout(()=>{
      //     console.log(event.message['message']['map']['orderId']);
      //     console.log(event['message']['summary']);
          
      //     this.msgs.splice(this.msgs.indexOf(event),1);
      //   },7000)

      //    }
      
  else {
  this.router.navigate(['/login']);
  }
 
  
}


}
