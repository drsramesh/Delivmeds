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
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  showButton: boolean = false;
  nav: MenuItem[];
  userInformation : any = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {

  }

//   public navigate(url: string):void {
//     console.log("123");
    
//     window.open(url);
//  }
//  window.open("https://www.google.com", "_blank");


}
