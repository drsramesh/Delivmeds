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
  msgs = [];
  showButton: boolean = false;
  userInformation : any = [];
  constructor(private router: Router,
    private http: HttpClient
) { }

  ngOnInit() {
    
    this.router.events.subscribe( (e) => {
      // this.RegisteredDetailsService();
      if(e instanceof NavigationEnd) {
        if ((e.url.split('/')[1] == 'login') || (e.url.split('/')[1] == 'register')  || (e.url == '/') || (e.url.split('/')[1] == 'forgot-password') || (e.url.split('/')[1] == 'change-password') ) {
          this.nav = [];
          this.showButton = false;
         
        }else {
          this.RegisteredDetailsService();
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

  logout(){
      // this.userService.logout().subscribe((res:any)=>{
        localStorage.clear();
        this.msgs = [];
        this.router.navigate(["/login"])
    
  }

  RegisteredDetailsService() {
    const header = {'authentication_token': localStorage.getItem('authentication_token')};
    this.http.get(environment.host + 'pharmacy/profile' ).subscribe(data =>
    {
     // console.log(JSON.stringify(data));
   this.userInformation = data;
  //  console.log(this.userInformation);
    localStorage.setItem('user_id', this.userInformation.id);
  
    });
}
}