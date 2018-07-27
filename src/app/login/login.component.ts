import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';


//third party
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {MessageService} from 'primeng/components/common/messageservice';

// Servies
import { UserService } from '../services/user.service';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';
import { finalize } from 'rxjs/operators';
import { PreloadService } from '../services/preload.service'
import { PubNubAngular } from 'pubnub-angular2';
import { PubnubService } from '../pubnub.service';

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
     private loader: PreloadService,
     private pubnub: PubNubAngular,
     private pb: PubnubService,
     private messageService: MessageService,
  )  {
      this.signInForm = this.fb.group({
        signinEmail: new FormControl(null, Validators.required),
        signinPassword: new FormControl(null, Validators.required),
      });
  }

  ngOnInit() {
      this.user.destroyUser();
      // localStorage.clear();
    }
    
  // sign in functionality
   signIn(signInForm) {
     this.loading = true
    if (signInForm.valid) {
      const params = {
        email: signInForm.value.signinEmail,
        password: signInForm.value.signinPassword
      };
       this.loader.open();
      this.auth.signIn(params).subscribe((res: any) => {
        console.log(res);
        if (res.statusCode === 200  && res.profileCompleted === true) {
          this.msgs = []; 
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
          localStorage.setItem('pharmacyId', res.pharmacyId)
            this.pb.subscribe("channel_"+res.pharmacyId)

             
           this.loader.close();
          this.tokenService.storeTokens(
            res['authentication_token']
           // res['refresh_token'],
          );
          this.router.navigate(['/orders']);
         
        }
        else if(res.statusCode === 200  && res.profileCompleted === false) {
          
          //alert('faliure');
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
           this.loader.close();
           localStorage.setItem('pharmacyId', res.pharmacyId)
          this.tokenService.storeTokens(
            res['authentication_token']
           // res['refresh_token'],
          );
        
      
          this.router.navigate(['/my-account']);
        } else if(res.statusCode === 401 && res.errors[0] ==="Please verify your email before you login"){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'your Email id is not verified'});
           this.loader.close();

        }
        // else if(res.statusCode === 401 && res.errors ===""){
        //   this.msgs = [];
        //   this.msgs.push({severity: 'error', summary: 'Error', detail: 'your Email id is not verified'});
        //    this.loader.close();

        // }
        else {
          //alert('faliure');
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Invalid credentials. Please try again'});
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
    } 
    else {
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
