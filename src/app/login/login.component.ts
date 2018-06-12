import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

// Servies
import { UserService } from '../services/user.service';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
signInForm: FormGroup;
loginFailed: Boolean = false;
data: any = { };
msgs = [];
loading = false;
submitted: boolean;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    // private _tokenService: TokenService,
     // private _auth: DelivMedsAuthService,
     // private _userService: UserService,
    // private _http: Http
  )  {
      this.signInForm = this._fb.group({
        signinEmail: new FormControl(null, Validators.required),
        signinPassword: new FormControl(null, Validators.required),
      });
  }

  ngOnInit() {
      console.log('login');
      // this._userService.destroyUser();
    }
  signIn(signInForm) {
   if (signInForm.valid) {
    const params = {
            email: signInForm.value.signinEmail,
            password: signInForm.value.signinPassword,
          };
          console.log('login success');
          this._router.navigate(['/orders']);
         } else {
          this.setFormTouched(this.signInForm);
           console.log('login unsuccessfull');
         }
}
  // function for validate all form fields
   setFormTouched(form_obj: any) {
    Object.keys(form_obj.controls).forEach(field => {
      const control = form_obj.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  // sign in functionality
  //  signIn(signInForm) {
  //   if (signInForm.valid) {
  //     const params = {
  //       email: signInForm.value.signinEmail,
  //       password: signInForm.value.signinPassword
  //     };
  //     // this._preLoader.open();
  //     this._auth.signIn(params).subscribe((res: any) => {
  //       if (res['success']) {
  //         this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
  //         // this._preLoader.close();
  //         this._tokenService.storeTokens(
  //           res['authentication_token'],
  //           res['refresh_token'],
  //         );
  //       //  this._userService.setUser(res['user']);
  //         this._router.navigate(['/orders']);
  //         // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
  //       } else {
  //         this.msgs.push({severity: 'error', summary: 'Error', detail: 'Invalid credentails. Please try again'});
  //         this.loginFailed = true;
  //        // this._toastr.error(res["message"], "Oops!", { 'showCloseButton': true });
  //        // this._preLoader.close();
  //       }
  //     }, (err) => {
  //       // this._preLoader.close();
  //       // this._toastr.error('Server Error', 'Oops!', { 'showCloseButton': true });
  //     }
  //     );
  //   } else {
  //     this.setFormTouched(this.signInForm);
  //   }
  // }

  //  // function for validate all form fields
  //  setFormTouched(form_obj: any) {
  //   Object.keys(form_obj.controls).forEach(field => {
  //     const control = form_obj.get(field);
  //     control.markAsTouched({ onlySelf: true });
  //   });
  // }
}
