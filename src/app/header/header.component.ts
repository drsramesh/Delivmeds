import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nav: any[];
  constructor() { }

  ngOnInit() {
    this.nav = [
      {
        label: 'Orders'
      },{
        label: 'My Account'
      },
      {
        label: 'Notifications'
      },
      {
        label: 'Logout',
        routerLink: '/login'
      }
    ]
  }

}
