import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Http, HttpModule } from '@angular/http';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { TabMenu } from 'primeng/tabmenu';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { HttpClient } from 'selenium-webdriver/http';
import { environment } from  '../../environments/environment';
import { PubnubService } from '../pubnub.service';
import { PubNubAngular } from 'pubnub-angular2';
import { Injectable,Injector,Inject } from '@angular/core';

import { UserService } from '../services/user.service'
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nav: MenuItem[];
  // msgs = [];
  showButton: boolean = false;
  userInformation : any = [];
  constructor(private router: Router,
    private http: HttpClient,
    private pb: PubnubService,
    public pubnub: PubNubAngular,
    public injector: Injector,@Inject(UserService) private userService
) { }

  ngOnInit() {
    
    this.router.events.subscribe( (e) => {
      
      // this.RegisteredDetailsService();
      if(e instanceof NavigationEnd) {
        
        if ((e.url.split('/')[1] == 'login') || (e.url.split('/')[1] == 'register')  || (e.url == '/') ||  (e.url.split('/')[1] == 'confirm-mail')|| (e.url.split('/')[1] == 'forgot-password') || (e.url.split('/')[1] == 'change-password') || e.url.split('/')[1].startsWith('confirm-mail') ||  (e.url.split('/')[1] == 'terms-conditions') || e.url.split('/')[1].startsWith('customer-mail') || e.url.split('/')[1].startsWith('member-mail')  || e.url.split('/')[1].startsWith('trxade-pharmacy-mail')) {
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
        let pb = this.injector.get(PubnubService)
        pb.unSubscribe(environment.channel+ localStorage.getItem('pharmacyId'))
        // this.msgs = [];
        this.router.navigate(["/login"])
     
        localStorage.clear();
        // console.log("unsubscribe");
        
    
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