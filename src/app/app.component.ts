import { Component, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import 'rxjs/add/operator/pairwise';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private router: Router) {
      this.toastr.setRootViewContainerRef(vcr);
      this.router.events.pairwise().subscribe((event) => {
        // console.log(event);
      });
}
}
