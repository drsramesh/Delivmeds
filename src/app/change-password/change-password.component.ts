import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {MessageService} from 'primeng/components/common/messageservice';

import { PreloadService } from '../services/preload.service';
import { matchPassword } from '../common.validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  signInForm: FormGroup;
  focusGain:boolean = false;
  msgs = [];
  constructor(
    private fb: FormBuilder,
    private toasts: ToastsManager,
    private router: Router,
    private loader: PreloadService,
    private auth: DelivMedsAuthService,
    private messageService: MessageService
  ) {
    
    this.signInForm = fb.group({
      oldpassword: new FormControl(null, Validators.required),
       newpassword: ['', [Validators.required]],
       confirmpassword: ['', [Validators.required]]
     }, { validator: matchPassword })
  }

  ngOnInit() {
  }


  // sign in functionality
  signIn(signInForm) {
    console.log(this.signInForm);
    
   if (signInForm.valid) {
     const params = {
      //  email: signInForm.value.signinEmail,
      oldpassword: signInForm.value.oldpassword,
      newpassword: signInForm.value.newpassword,
      confirmpassword: signInForm.value.confirmpassword,
     };
      this.loader.open();
     this.auth.signIn(params).subscribe((res: any) => {
       if (res.statusCode === 200 ) {
         this.msgs = [];
         this.messageService.add({severity: 'success', summary: 'Success', detail: ' Password updated Successfully'});         
        // localStorage.setItem('pharmacyId', res.pharmacyId)
        //   this.pb.subscribe("channel_"+res.pharmacyId)
           // this.pubnub.subscribe({
           
           //      channels: ['channel_1252' ] ,
           //      withPresence: true
           //  });

            
          this.loader.close();
        // this.tokenService.storeTokens(
           res['authentication_token']
          // res['refresh_token'],
        // );
         this.router.navigate(['/orders']);
         // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
       }
       else if(res.statusCode === 200  && res.profileCompleted === false) {
         
         //alert('faliure');
         this.msgs = [];
         this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully logged in.'});
          this.loader.close();
         // localStorage.setItem('pharmacyId', res.pharmacyId)
       
       // this.user.setUser(res['user']); emailVerified
         this.router.navigate(['/my-account']);
       } else if(res.statusCode === 401){
         this.msgs = [];
         this.msgs.push({severity: 'error', summary: 'Error', detail: 'Invalid credentails. Please try again or  your Email id is not verified'});
          this.loader.close();

       }else {
         //alert('faliure');
         this.msgs = [];
         this.msgs.push({severity: 'error', summary: 'Error', detail: 'Invalid credentails. Please try again'});
        // this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
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

  focusMethod(){
    // console.log("Focused")
    this.focusGain = true;
}
focusMethod1(){
  // console.log("Focused")
  this.focusGain = false;
}

  // function for validate all form fields
  setFormTouched(form_obj: any) {
   Object.keys(form_obj.controls).forEach(field => {
     const control = form_obj.get(field);
     control.markAsTouched({ onlySelf: true });
   });
 }
}