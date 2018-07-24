import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PreloadService } from '../services/preload.service'
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  signInForm: FormGroup;
  msgs = [];

  constructor(
    private fb: FormBuilder,
    private toasts: ToastsManager,
    private router: Router,
    private auth: DelivMedsAuthService,
    private loader: PreloadService,
    private messageService: MessageService
  ) { 
    this.signInForm = this.fb.group({
      signinEmail: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
  }
  signIn(signInForm) {
    if (signInForm.valid) {
      const params = {
        email: signInForm.value.signinEmail,
        password: signInForm.value.signinPassword
      };
       this.loader.open();
      this.auth.signIn(params).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.msgs = [];
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully sent you password to your  register mail id'}); 
          this.loader.close();
          
          // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
        }
       else if(res.statusCode === 401){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Email id is not correct'});
           this.loader.close();
        }
      }, (err) => {
        this.loader.close();
       
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
