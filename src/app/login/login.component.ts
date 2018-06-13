import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

//third party
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
    private fb: FormBuilder,
    private toasts: ToastsManager,
    private router: Router,
     private tokenService: TokenService,
      private auth: DelivMedsAuthService,
     private user: UserService,
     private http: Http
  )  {
      this.signInForm = this.fb.group({
        signinEmail: new FormControl(null, Validators.required),
        signinPassword: new FormControl(null, Validators.required),
      });
  }

  ngOnInit() {
      console.log('login');
      this.user.destroyUser();
    }
//   signIn(signInForm) {
//    if (signInForm.valid) {
//     const params = {
//             email: signInForm.value.signinEmail,
//             password: signInForm.value.signinPassword,
//           };
//           console.log('login success');
//           this.router.navigate(['/orders']);
//          } else {
//           this.setFormTouched(this.signInForm);
//            console.log('login unsuccessfull');
//          }
// }
//   // function for validate all form fields
//    setFormTouched(form_obj: any) {
//     Object.keys(form_obj.controls).forEach(field => {
//       const control = form_obj.get(field);
//       control.markAsTouched({ onlySelf: true });
//     });
//   }

  // sign in functionality
   signIn(signInForm) {
     console.log(this.signInForm)
    if (signInForm.valid) {
      const params = {
        email: signInForm.value.signinEmail,
        password: signInForm.value.signinPassword
      };
      // this._preLoader.open();
      this.auth.signIn(params).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
          //alert('success')
          // this._preLoader.close();
          this.tokenService.storeTokens(
            res['auth_TOKEN']
           // res['refresh_token'],
          );
        
        //  this._userService.setUser(res['user']);
          this.router.navigate(['/orders']);
          // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
        } else {
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Invalid credentails. Please try again'});
          this.loginFailed = true;
          this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
         // this._preLoader.close();
        }
      }, (err) => {
        // this._preLoader.close();
         this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
      }
      );
    } else {
      this.setFormTouched(this.signInForm);
    }
   }


   // function for validate all form fields
   setFormTouched(form_obj: any) {
    Object.keys(form_obj.controls).forEach(field => {
      const control = form_obj.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}
