import { Component, OnInit } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


//third party
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// Model

import { User } from '../Interface/createUser';
// services
import { StateService } from '../services/state.service';
import { EmailRegistrationService }from '../services/email-registration.service';
import { promise } from 'protractor';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signInForm: FormGroup;
  createuser: any = {};
  msgs = [];
  loginFailed = false;
  //mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mask: any[] = [ /[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // countries: any [];
  filteredCountriesMultiple: any[];
  brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];
  countries: string[] = ['India', 'United staes of America', 'U.S.A', 'Bangladesh'];

  filteredBrands: any[];
  filteredCountries: any[];

  brand: string;
  country: string;


  constructor(
    private fb: FormBuilder,
    private toasts: ToastsManager,
    private StateService: StateService,
    private user: UserService,
    private emailService: EmailRegistrationService,
    private auth: DelivMedsAuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      pharmacyName: new FormControl(null, Validators.required),
      phoneNo: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      zipcode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
//       inemail: ["", [
//         Validators.required],
//       this.isEmailUnique.bind(this) // async Validator passed as 3rd parameter 
//  ],
       state: new FormControl(null, Validators.required)
       });
  }


  // isEmailUnique(control: FormControl) {
  //   const email = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       this.emailService.isEmailRegisterd(control.value).subscribe(() => {
  //         resolve(null);
  //       }, () => { resolve({ 'isEmailUnique': true }); });
  //     }, 1000);
  //   });
  //   return email;
  // }

  ngOnInit() {
   console.log('login');
  }


filterCountries(event) {
  this.filteredCountries = [];
  for (let i = 0; i < this.countries.length; i++) {
    const country = this.countries[i];
    if (country.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredCountries.push(country);
    }
}

}


// signIn(signInForm) {
//   console.log('register');

//   if (signInForm.valid) {
//    const params = {
//            username: signInForm.value.username,
//            phonenumber: signInForm.value.phonenumber,
//            email: signInForm.value.signinEmail,
//            password: signInForm.value.inPassword,
//            address: signInForm.value.address,
//            address1: signInForm.value.address1,
//            zipcode: signInForm.value.zipcode,
//            city: signInForm.value.city
//           //  state: signInForm.value.state

//          };
//          console.log('Registration  successfull');
//          // this._router.navigate(['/orders']);
//         } else {
//          this.setFormTouched(this.signInForm);
//           console.log('Registration unsuccessfull');
//         }
//       }
// // function for validate all form fields

    
    
// sign in functionality
   signUp(signInForm) {
     this.msgs = [];
     console.log(this.signInForm.value);
     
    if (signInForm.valid) {
      const params = {
        pharmacyName: signInForm.value.pharmacyName,
        phoneNo: signInForm.value.phoneNo,
        email: signInForm.value.email,
        password: signInForm.value.password,
        address: signInForm.value.address,
        street: signInForm.value.street,
        zipcode: signInForm.value.zipcode
        // city: signInForm.value.city
      };
      // this._preLoader.open();
      this.auth.signUp(params).subscribe((res: any) => {
        console.log(res);
        // console.log(res.statusCode);
        // console.log(res['statusCode']);
        // console.log(res);
        if (res.statusCode == 200) {
          console.log(res);
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully Registered.'});
          alert("success");
          // this._preLoader.close();
          //  this.tokenService.storeTokens(
          //    res['authentication_token'],
          //    res['refresh_token'],
          //  );
           this.user.createUser(res['user']);
          this.router.navigate(['/login']);
          
          // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
        } else if(res.statusCode == 401){
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'already registered '});
          this.loginFailed = true;
          this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          alert("failure");
         // this._preLoader.close();
        }
        else {
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'registration unsuccesfull'});
          this.loginFailed = true;
          this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          alert("failure");
         // this._preLoader.close();
        }
      }, (err) => {
        // this._preLoader.close();
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
         this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
         alert("server error");
      }
      );
    } else {
      this.setFormTouched(this.signInForm);
    }
  }

  setFormTouched(form_obj: any) {
    Object.keys(form_obj.controls).forEach(field => {
      const control = form_obj.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  
  }
}
