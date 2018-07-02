import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
//   constructor( private router: Router) {
//     this.router.events.pairwise().subscribe((event) => {
// //console.log(event);
//     });
//   }
}
