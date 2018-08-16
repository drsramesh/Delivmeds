// Importing Internal modules
import { Router} from '@angular/router';
import { Injectable,Injector,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserService } from './services/user.service';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs'
import { PubnubService } from '././pubnub.service'

@Injectable()
export class AppInitService {
 
  constructor(private http:HttpClient, public injector: Injector,@Inject(UserService) private userService) {  }

     pharmacyId: any
  //Checking for the tokens if exists we will get the profile otherwise we will redirect it to sign-in page
initializeApp(): Observable<any>{
  localStorage.getItem('pharmacyId')
  if(localStorage.getItem('authentication_token') !== null){ 
    let pb = this.injector.get(PubnubService)
    pb.subscribe("channel_"+ localStorage.getItem('pharmacyId')) || pb.subscribe("channel_dev_"+ localStorage.getItem('pharmacyId'))
  if(window.location.pathname === '/order-view' || window.location.pathname === '/my-account' ||  window.location.pathname === 'order-view/:id' || window.location.pathname === '/notifications'  || window.location.pathname === '/change-password'){
  this.injector.get(Router).navigate(['/orders']);
  }
  return;
  } else if( window.location.pathname === '/order-view/Success'){
    console.log("sucess");
    
  }
  else {
    console.log("Failure")
    // this.injector.get(Router).navigate(['/login']);
  }
  }
  }