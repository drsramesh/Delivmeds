import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Http, HttpModule } from '@angular/http';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { TabMenu } from 'primeng/tabmenu';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { HttpClient } from 'selenium-webdriver/http';
import { environment } from  '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nav: MenuItem[];
  showButton: boolean = false;
  userInformation : any = [];
  constructor(private router: Router,
    private http: HttpClient
) { }

  ngOnInit() {
    this.RegisteredDetailsService();
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

  RegisteredDetailsService() {
    const header = {'authentication_token': localStorage.getItem('authentication_token')};
    console.log(header);
    console.log("auth" + localStorage.getItem ('authentication_token'));
    

    this.http.get(environment.host + '/pharmacy/profile' ).subscribe(data =>
    {
      console.log(JSON.stringify(data));
   this.userInformation = data;
    console.log(this.userInformation);
  
    });
}
}
