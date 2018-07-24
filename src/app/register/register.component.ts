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
import { promise } from 'protractor';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { PreloadService } from '../services/preload.service'
import { DISABLED } from '@angular/forms/src/model';
import { LoginComponent } from '../login/login.component';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import {MessageService} from 'primeng/components/common/messageservice';



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
  visible:boolean = false;
  focusGain:boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toasts: ToastsManager,
    private user: UserService,
    private auth: DelivMedsAuthService,
    private tokenService: TokenService,
    private router: Router,
    private loader: PreloadService,
    private messageService: MessageService
  ) {
    this.signInForm = this.fb.group({
      pharmacyName: new FormControl(null, Validators.required),
      deaNumber: new FormControl(null, Validators.required),
      phoneNo: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      street: new FormControl(null),
      
      zipcode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
       state: new FormControl(null, Validators.required)
       });
  }

  isDisabled() : boolean{
    return this.is_edit;
  }

  

  ngOnInit() {
  }

  filterCountrySingle(event) {
    console.log(event);
     let query = event.query;
    //  this.http.get(environment.host + 'zipcodes/get/' + this.signInForm.value.zipcode.code ).subscribe((res: any) => {
      
    //   if(res.statusCode === 401) {
    //     this.signInForm.patchValue({city: "" ,state: ""});
      
    //   } else {
    //     console.log(this.signInForm.value.zipcode);
    //         console.log(JSON.stringify(res));
    //      this.zipCodeServices = res;
    //       console.log(this.zipCodeServices);
    //       this.signInForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
    //   }
      
    //       })
     this.http.get(environment.host + 'zipcodes/serviceable/' + this.signInForm.value.zipcode ).subscribe(country => {
       console.log(country)
       if(country['statusCode']==401){
        this.filteredCountriesSingle=[];
        this.msgs = [];
        this.signInForm.patchValue({city: "" ,state: ""});
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'Zipcode not available '})
       }else{
        this.filteredCountriesSingle=[]
        country['object'].forEach(country=>{
          this.filteredCountriesSingle.push({name:country,code:country})
          
        })
       }
     })
}

zipcodeServiceTab(country) {

  if(this.signInForm.value.zipcode == '' || this.signInForm.value.zipcode == null){
    this.signInForm.patchValue({city: "" ,state: ""});
  }
   else{
  this.http.get(environment.host + 'zipcodes/get/' + country ).subscribe((res: any) => {
    console.log(res);
    
if(res.statusCode === 401) {
//alert('zipcode is not servicable')
this.signInForm.patchValue({city: "" ,state: ""});
this.msgs = [];
this.msgs.push({severity: 'error', summary: 'Error', detail: 'Zipcode is not servicable '})
} else {
  this.signInForm.value.zipcode = country
 this.zipCodeServices = res;
  console.log(this.zipCodeServices);
  this.signInForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
}  

  })
}
}


  zipcodeService(event) { 
    this.http.get(environment.host + 'zipcodes/get/' + this.signInForm.value.zipcode.code ).subscribe((res: any) => {
      
if(res.statusCode === 401) {
  this.signInForm.patchValue({city: "" ,state: ""});

} else {
  console.log(this.signInForm.value.zipcode);
      console.log(JSON.stringify(res));
   this.zipCodeServices = res;
    console.log(this.zipCodeServices);
    this.signInForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
}

    })
  }
  
    
// sign in functionality
   signUp(signInForm) {
     console.log(this.signInForm.value);
     
    if (signInForm.valid) {
      const params = {
        pharmacyName: signInForm.value.pharmacyName,
        deaNumber: signInForm.value.deaNumber,
        phoneNo: signInForm.value.phoneNo,
        email: signInForm.value.email,
        password: signInForm.value.password,
        address: signInForm.value.address,
        street: signInForm.value.street || '',
        zipcode: signInForm.value.zipcode,
         city: signInForm.value.city
        // dea: signInForm.value.eda
      };
      console.log("called");
      console.log(params);
      
       this.loader.open();
      this.auth.signUp(params).subscribe((res: any) => {
        console.log(res);
        if (res.statusCode == 200) {
          console.log(res);
         
      
           this.loader.close();
         
           this.msgs = [];
          this.router.navigate(['/login']);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Thank you for signing up with DelivMeds. You will receive a confirmation email shortly. If you do not see this email in your Inbox, please check your Spam / Junk folder.'});
        } else if(res.statusCode != 200){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: ' Email is already registered with different Pharmacy '});
          this.loginFailed = true;
       
         this.loader.close();
        }
        else {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'registration unsuccesfull'});
          this.loginFailed = true;
          this.loader.close();
        }
      }, (err) => {
        this.loader.close();
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
      }
      );
    } else {
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

  setFormTouched(form_obj: any) {
    Object.keys(form_obj.controls).forEach(field => {
      const control = form_obj.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  
  }
}