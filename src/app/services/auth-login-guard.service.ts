import { Injectable } from '@angular/core';
import { CanActivate,CanDeactivate,ActivatedRouteSnapshot,RouterStateSnapshot,CanActivateChild,Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DelivMedsAuthService } from './deliv-meds-auth.service'

@Injectable()
export class AuthLoginGuardService implements CanActivate, CanActivateChild {

  constructor(private _auth:DelivMedsAuthService,private _router:Router) { }

   //Activating the auth route if not logged in
   canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot) : Observable<boolean>|Promise<boolean>|boolean{
    
    return this._auth.isAuthenticated().then(
      (authenticated:boolean)=>{
         if(!authenticated){
           return true;
         }else{
           return false;
          }
      }
    )
  }

  //Activating child routes of auth module
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this._auth.isAuthenticated().then(
      (authenticated:boolean)=>{
         if(!authenticated){
          return true;
         }else{
           this._router.navigate(["/login"]);
           return false;
          }
      }
    )
  }

}
