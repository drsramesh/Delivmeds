import { Component, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import 'rxjs/add/operator/pairwise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from  '../environments/environment';

//pub nub
import { PubNubAngular } from 'pubnub-angular2';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message;
  title = 'app';
 

  constructor(
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private router: Router,
    private http: HttpClient,
    public pubnub: PubNubAngular
    ) {
      this.toastr.setRootViewContainerRef(vcr);
      this.router.events.pairwise().subscribe((event) => {
      });
}

ngOnInit() {
  this.pubnub.init({
    publishKey: 'pub-c-b62f7ab5-0dde-4000-a2c2-8a2df4d7d658',
    subscribeKey: 'sub-c-d7fdeca6-85c2-11e8-a7a7-6244ec17d0a3',
    ssl: false
    });
 
this.pubnub.addListener({
  status: function(st) {
      if (st.category === "PNConnectedCategory") {
        console.info('notifications connected')
      }
  },
  message: function(message) {
      console.dir(message);
      console.log(message)
      this.msgs.push({severity: 'success', summary: 'Success', detail: 'Notification Received.'});
  }
});


}


}
