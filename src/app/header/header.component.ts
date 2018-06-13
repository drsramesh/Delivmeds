import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

import { Router, Event, NavigationEnd } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { TabMenu } from 'primeng/tabmenu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nav: MenuItem[];
  showButton: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe( (e) => {
     
      if(e instanceof NavigationEnd) {
        console.log(e.url == '/')
        console.log(e.url.split('/')[1])
        console.log( e.url.split('/')[1] == 'login')
         console.log(e.url.split('/')[1] == 'register')
         console.log((e.url.split('')[1] == ''))
        
        if ((e.url.split('/')[1] == 'login') || (e.url.split('/')[1] == 'register')  || (e.url == '/')) {
          this.nav = [];
          this.showButton = false;
          console.log(this.showButton)
         
        }else {
          this.nav = [
            {
              label: 'Orders',
              routerLink: '/orders',
            }, {
              label: 'My Account',
              routerLink: '/my-account'
            },
            {
              label: 'Notifications',
              routerLink: '/notifications'
            }
          ];
          this.showButton = true;
              
        }
          
        }
      });
    
  }
}
  
