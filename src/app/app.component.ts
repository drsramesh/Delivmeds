import { Component, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import 'rxjs/add/operator/pairwise';
import { MessagingService } from './messaging.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message;
  title = 'app';
  // template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
 
 

  constructor(
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private router: Router,
    private msgService: MessagingService
    ) {
      this.toastr.setRootViewContainerRef(vcr);
      this.router.events.pairwise().subscribe((event) => {
        // console.log(event);
      });
}

ngOnInit() {
 // this.msgService.getPermission()
 // this.msgService.receiveMessage()
  //this.message = this.msgService.currentMessage
}
}
