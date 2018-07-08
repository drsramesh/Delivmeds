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
import { LoginComponent } from '../login/login.component';
import { AUTH_PROVIDERS } from 'angular2-jwt';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signInForm: FormGroup;
  filteredCountriesSingle: any=[];
  createuser: any = {};
  msgs = [];
  loginFailed = false;
  zipCodeServices: any={};
  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 // mask: any[] = [ /[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
   countries:  any[];
   
  filteredCountriesMultiple: any[];
  brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];
  // countries: string[] = ['India', 'United staes of America', 'U.S.A', 'Bangladesh'];

  filteredBrands: any[];
  filteredCountries: any[];

  brand: string;
  //country: string;
  is_edit: boolean = false;

  //autocomplete
  country: any[]

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
      // dea: new FormControl(null, Validators.required),
      zipcode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
//       inemail: ["", [   [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
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
  // console.log('login');
  }

  filterCountrySingle(event) {
    console.log(event);
    // let query = event.query;
    // this.StateService.getCountries().then(country => {
    //     this.filteredCountriesSingle = this.filterCountry(query, country);
    // });
     let query = event.query;
    //  this.filteredCountriesSingle = [{name:undefined,code:undefined}];
    // http://35.153.176.128/zipcodes/serviceable/5
     this.http.get(environment.host + 'zipcodes/serviceable/' + this.signInForm.value.zipcode ).subscribe(country => {
       if(country['statusCode']==401){
        this.filteredCountriesSingle=[];
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'Zipcode not available '})
       }else{
        this.filteredCountriesSingle=[]
        country['object'].forEach(country=>{
          this.filteredCountriesSingle.push({name:country,code:country})
          
        })
       }
     
     
     })
}

// filterCountry(query, countries: any):any {
//   console.log(query);
//   console.log(countries);
  
  
//   //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
//   let filtered : any[] = [];
//   for(let i = 0; i < countries.length; i++) {
//       let country = countries[i];
//       if(country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
//           filtered.push(country);
//       }
//   }
//   return filtered;
// }


  zipcodeService(event) {
    console.log(event)
    console.log(this.signInForm.value.zipcode.code);
    
    this.http.get(environment.host + 'zipcodes/get_serviceable/' + this.signInForm.value.zipcode.code ).subscribe((res: any) => {
      console.log(res);
      
if(res.statusCode === 401) {
  //alert('zipcode is not servicable')
  this.signInForm.patchValue({city: "" ,state: ""});

} else {
  console.log(this.signInForm.value.zipcode);
      console.log(JSON.stringify(res));
   this.zipCodeServices = res;
  // this.zipcodeService.push
    console.log(this.zipCodeServices);
    this.signInForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
}

    })
  }
  
    
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
        zipcode: signInForm.value.zipcode.code,
         city: signInForm.value.city
        // dea: signInForm.value.eda
      };
      console.log("called");
      
       this.loader.open();
      this.auth.signUp(params).subscribe((res: any) => {
        console.log(res);
        // console.log(res.statusCode);
        // console.log(res['statusCode']);
        // console.log(res);
        if (res.statusCode == 200) {
          console.log(res);
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully Registered.'});
          //alert("success");
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
         // this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          //alert("failure");
         this.loader.close();
        }
        else {
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'registration unsuccesfull'});
          this.loginFailed = true;
          //this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
          //alert("failure");
          this.loader.close();
        }
      }, (err) => {
        this.loader.close();
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
         //this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
        // alert("server error");
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
