import { Injectable, Inject, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/empty";
import { Router } from "@angular/router";

//Importing Third-party modules
import { tokenNotExpired } from "angular2-jwt";
//Imporitng Application Modules

//Importing Application components

// Importing Application Services
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { PreloadService } from '../services/preload.service';
import { DelivMedsAuthService } from "./deliv-meds-auth.service";
//Any Other Please specify

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private _injector: Injector,
    private _tokenService: TokenService
  ) { }

  // 
  //Adding Headers for the requests skip headers if there is no auth_token
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req)

    let headers = {};
    // using Authentication token

    if (localStorage.getItem("authentication_token") !== null) {
      // this._tokenService.open()
      console.log('T= valid');
      
       headers = {
         setHeaders: {
           
           'authentication_token': localStorage.getItem("authentication_token"),
           'Content-Type': 'application/json; charset=UTF-8' 

        
         }
       };
    }
    const request = req.clone(headers);
    console.log(request);
    
    // const request = req.clone({
    //         headers: req.headers.set('authentication-token', localStorage.getItem("authentication_token"))
    //      });

    return <any>next
      .handle(request)
       .map((event: HttpEvent<any>) => {
         if (event instanceof HttpResponse) {
            if (request.headers.keys()[0] == "refresh_token") {
             this._tokenService.storeTokens(
               event.body["authentication_token"]
             );
            }
           return event;
         }
       })
       .catch((error: any) => {
         // this._tokenService.close();
       //Catching the error checking for the relogin component intialiazation
         const _router = this._injector.get(Router);
         //const _redirect = this._injector.get(RedirectionService);
         const _user = this._injector.get(UserService);
         const _auth = this._injector.get(DelivMedsAuthService);
         const _preloader = this._injector.get(PreloadService);

         if (error.status === 401) {
           const _auth = this._injector.get(DelivMedsAuthService);
           if (error.error.message === "Authentication token expired.") {
             console.log("Authentication token expired.");
             
            //  const authReq = req.clone({
            //  //  headers: req.headers.set(
            //      "refresh_token",
            //     localStorage.getItem("refresh_token")
            //    )
            //  });
            //  return next.handle(authReq)
            //    .map((response: HttpEvent<any>) => {
            //     if (response instanceof HttpResponse) {
            //       this._tokenService.storeTokens(response.body['authentication_token']);
            //       return response;
            //     }
            //   })
              // .catch((error: any) => {
              //   _preloader.close();
                // if (_user.getUser().hasOwnProperty("role")) {
                //   return _redirect.relogin().flatMap(res => {
                //     if (res) {
                //       const reloginReq = req.clone({
                //         headers: req.headers.set(
                //           "authentication_token",
                //           localStorage.getItem("authentication_token")
                //         )
                //       });
                //       return next.handle(reloginReq);
                //     } else {
                //       _auth.redirectTo();
                //       return Observable.empty();

                //     }
                //   })
                // }
              //   return Observable.empty();
              // })

          }else if(error.error.message == "Not Authenticated.") {            
              _preloader.close();
              console.log("not autenticated");
              
            //   if (_user.getUser().hasOwnProperty("role")) {
            //     return _redirect.relogin().flatMap(res => {
            //       if (res) {
            //         const reloginReq = req.clone({
            //           headers: req.headers.set(
            //             "refresh_token",
            //             localStorage.getItem("refresh_token")
            //           )
            //         });
            //         return next.handle(reloginReq);
            //       } else {
            //         _auth.redirectTo();
            //         return Observable.empty();
            //       }
            //     })
            //   } else {
               // _auth.redirectTo();
             // }
              return Observable.empty();
          }else if (error.error.message === "Session expired!") {
            _preloader.close();
            console.log('session expired');
            // if (_user.getUser().hasOwnProperty("role")) {
            //   return _redirect.relogin().flatMap(res => {
            //     if (res) {
            //       const reloginReq = req.clone({
            //         headers: req.headers.set(
            //           "refresh_token",
            //           localStorage.getItem("refresh_token")
            //         )
            //       });
            //       return next.handle(reloginReq);
            //     } else {
            //       _auth.redirectTo();
            //       return Observable.empty();
            //     }
            //   })
            // } else {
            //   _auth.redirectTo();
            // }
            return Observable.empty();
          }
        }
        return Observable.throw(error);
      });

  }
}
