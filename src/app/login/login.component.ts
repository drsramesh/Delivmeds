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
import { finalize } from 'rxjs/operators';
import { PreloadService } from '../services/preload.service'

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
     private http: Http,
     private loader: PreloadService
  )  {
      this.signInForm = this.fb.group({
        signinEmail: new FormControl(null, Validators.required),
        signinPassword: new FormControl(null, Validators.required),
      });
  }

  ngOnInit() {
      console.log('login');
      this.user.destroyUser();
      console.log(localStorage.getItem("authentication_token"));
      // localStorage.clear();
      // console.log(localStorage.getItem("authentication_token"));
    }
    
  // sign in functionality
   signIn(signInForm) {
     this.loading = true
    this.msgs = [];
     console.log(this.signInForm)
    if (signInForm.valid) {
      const params = {
        email: signInForm.value.signinEmail,
        password: signInForm.value.signinPassword
      };
       this.loader.open();
      this.auth.signIn(params).subscribe((res: any) => {
        console.log(res);
        // console.log(res.statusCode == 200);
        // console.log(res.profileCompleted == false);
        // console.log( (res.statusCode == 200 ) && (res.profileCompleted == false));
        
        console.log(res.profileCompleted)
        if (res.statusCode === 200  && res.profileCompleted === true) {
          console.log(res.profileCompleted)
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
          //alert('success')
           this.loader.close();
          this.tokenService.storeTokens(
            res['authentication_token']
           // res['refresh_token'],
          );
          this.router.navigate(['/orders']);
          console.log('orders')
          // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
        }
        else if(res.statusCode === 200  && res.profileCompleted === false) {
          console.log('profile completed false');
          
          //alert('faliure');
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
           this.loader.close();
          this.tokenService.storeTokens(
            res['authentication_token']
           // res['refresh_token'],
          );
        
        // this.user.setUser(res['user']);
          this.router.navigate(['/my-account']);
        } else {
          //alert('faliure');
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Invalid credentails. Please try again or your email is not verified'});
          this.loginFailed = true;
          this.loading = false;
         // this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          this.loader.close();
        }
      }, (err) => {
        this.loader.close();
        this.loading = false;
        // this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
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
