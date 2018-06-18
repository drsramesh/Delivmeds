import { Component, OnInit } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
 import {  environment } from '.././../environments/environment'

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
import { PreloadService } from '../services/preload.service'
import { DISABLED } from '@angular/forms/src/model';



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
  zipCodeServices: any={};
  //mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mask: any[] = [ /[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
   countries: any [];
  filteredCountriesMultiple: any[];
  brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];
  // countries: string[] = ['India', 'United staes of America', 'U.S.A', 'Bangladesh'];

  filteredBrands: any[];
  filteredCountries: any[];

  brand: string;
  country: string;
  is_edit: boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toasts: ToastsManager,
    private StateService: StateService,
    private user: UserService,
    private emailService: EmailRegistrationService,
    private auth: DelivMedsAuthService,
    private tokenService: TokenService,
    private router: Router,
    private loader: PreloadService
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

  isDisabled() : boolean{
    return this.is_edit;
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
   //this.zipcodeServicesForTest();
  }

  filterCountryMultiple(event) {
    let query = event.query;
    this.StateService.getCountries().then(countries => {
        this.filteredCountriesMultiple = this.filterCountry(query, countries);
    });
}
filterCountry(query, countries: any):any {
  //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  let filtered : any[] = [];
  for(let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if(country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }
  let country = countries;
  console.log(countries);
  
  if(country.zipCode) {
      filtered.push(country);
      console.log(country);
  return filtered;
 
  
}
}

  // zipcodeService(){
  //   console.log('zipcode service is pressed');
    
  // }


zipcodeServicesForTest()
{
  
  this.filteredCountries = [];
  const header = {'authentication_token': localStorage.getItem('authentication_token')};
    console.log(header);
    console.log("auth" + localStorage.getItem ('authentication_token'));
    
    this.http.get(environment.host + 'zipcodes/get_serviceable/501', { headers: header} ).subscribe(data =>
    {
      console.log(JSON.stringify(data));
   this.zipCodeServices = data;
  // this.zipcodeService.push
    console.log(this.zipCodeServices);
    this.signInForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
  
    });
}

//  filterCountries(event) {
//    this.filteredCountries = [];
//   let query = event.query
//   const header = {'authentication_token': localStorage.getItem('authentication_token')};
//     console.log(header);
//     console.log("auth" + localStorage.getItem ('authentication_token'));
    
//     this.http.get(environment.host + 'zipcodes/get_serviceable/501', { headers: header} ).subscribe(data =>
//     {
//       console.log(JSON.stringify(data));
//    this.zipCodeServices = data;
//    this.filteredCountries = this.filterCountries(query,data)
//   // this.zipcodeService.push
//     console.log(this.zipCodeServices);
  
//     });
//   this.http.get()
//   for (let i = 0; i < this.countries.length; i++) {
//     const country = this.countries[i];
//     if (country.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
//         this.filteredCountries.push(country);
//     }
// }


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
       this.loader.open();
      this.auth.signUp(params).subscribe((res: any) => {
        console.log(res);
        // console.log(res.statusCode);
        // console.log(res['statusCode']);
        // console.log(res);
        if (res.statusCode == 200) {
          console.log(res);
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully Registered.'});
          alert("success");
           this.loader.close();
          //  this.tokenService.storeTokens(
          //    res['authentication_token'],
          //    res['refresh_token'],
          //  );
           this.user.createUser(res['user']);
           console.log(res['user']);
          this.router.navigate(['/login']);
          
          // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
        } else if(res.statusCode != 200){
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'already registered '});
          this.loginFailed = true;
          this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          alert("failure");
         this.loader.close();
        }
        else {
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'registration unsuccesfull'});
          this.loginFailed = true;
          this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          alert("failure");
          this.loader.close();
        }
      }, (err) => {
        this.loader.close();
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
