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
  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
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
      username: new FormControl(null, Validators.required),
      phonenumber: new FormControl(null, Validators.required),
      signinEmail: new FormControl(null, Validators.required),
      inPassword: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      address1: new FormControl(null, Validators.required),
      zipcode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      inemail: ["", [
        Validators.required],
      this.isEmailUnique.bind(this) // async Validator passed as 3rd parameter 
 ],
      state: new FormControl(null, Validators.required)
       });
  }


  isEmailUnique(control: FormControl) {
    const email = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.emailService.isEmailRegisterd(control.value).subscribe(() => {
          resolve(null);
        }, () => { resolve({ 'isEmailUnique': true }); });
      }, 1000);
    });
    return email;
  }

  ngOnInit() {
   console.log('login');
  }

//   filterCountryMultiple(event) {
//     this.filtercountry = [];
//     const query = event.query;
//     this.StateService.getCountries().then(countries => {
//         this.filteredCountriesMultiple = this.filterCountry(query, countries);
//     });
// }

// filterCountry(query, countries: any[]): any[] {
//   // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
//   const filtered: any[] = [];
//   for (let i = 0; i < countries.length; i++) {
//       const country = countries[i];
//       if (country.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
//           filtered.push(country);
//       }
//   }
//   return filtered;
// }


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
    if (signInForm.valid) {
      const params = {
        username: signInForm.value.username,
        phonenumber: signInForm.value.phonenumber,
        email: signInForm.value.signinEmail,
        password: signInForm.value.inPassword,
        address: signInForm.value.address,
        address1: signInForm.value.address1,
        zipcode: signInForm.value.zipcode,
        city: signInForm.value.city
      };
      // this._preLoader.open();
      this.auth.signUp(params).subscribe((res: any) => {
        if (res['success']) {
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully Registered.'});
          // this._preLoader.close();
          this.tokenService.storeTokens(
            res['authentication_token'],
            res['refresh_token'],
          );
          this.user.createUser(res['user']);
          this.router.navigate(['']);
          
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

  setFormTouched(form_obj: any) {
    Object.keys(form_obj.controls).forEach(field => {
      const control = form_obj.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  
  }
}
