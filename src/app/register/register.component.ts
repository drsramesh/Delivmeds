import { Component, OnInit, Input, Output } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
 import {  environment } from '.././../environments/environment';

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
import {RadioButtonModule} from 'primeng/radiobutton';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  show: boolean;
  signInForm: FormGroup;
  filteredCountriesSingle: any=[];
  createuser: any = {};
  msgs = [];
  loginFailed = false;
  zipCodeServices: any={};
  debouncer: any;
  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  countries:  any[];
  filteredCountriesMultiple: any[];
  filteredBrands: any[];
  filteredCountries: any[];
  brand: string;
  is_edit: boolean = false;
  country: any[]
  visible:boolean = false;
  focusGain:boolean = false;
  contact_number:number;
  constructor(
    
    private fb: FormBuilder,
    private http: HttpClient,
    private toasts: ToastsManager,
    private user: UserService,
    private auth: DelivMedsAuthService,
    private tokenService: TokenService,
    private router: Router,
    private loader: PreloadService,
    private messageService: MessageService)
    {
      this.signInForm = this.fb.group({
      pharmacyName: new FormControl(null, Validators.required),
      deaNumber: new FormControl(null, Validators.required),
      phoneNo: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      street: new FormControl(null),
      deliveryType : new FormControl('true'),
      zipcode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required)
    });
    this.show = false;
    }

  isDisabled() : boolean{
    return this.is_edit;
    }

  ngOnInit() {
    }

  filterCountrySingle(event) {
      console.log(event);
      let query = event.query;
      this.http.get(environment.host + 'zipcodes/serviceable/' + this.signInForm.value.zipcode ).subscribe(country => {
      console.log(country)
      if(country['statusCode']==401){
      this.filteredCountriesSingle=[];
      this.msgs = [];
      this.signInForm.patchValue({city: "" ,state: ""});
      this.msgs.push({severity: 'error', summary: 'Error', detail: 'Zipcode not available.'})
    }else{
        this.filteredCountriesSingle=[]
        country['object'].forEach(country=>{
        this.filteredCountriesSingle.push({name:country,code:country})
    })
         }
    })
  }

display: boolean = false;
register:boolean = true

showDialog1() {
    this.display = true;  
  }
  
public debounceTime: number = 500;
zipcodeServiceTab(country) {

    this.debouncer = setTimeout(() => {
   console.log(this.debouncer)
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
  // this.msgs.push({severity: 'error', summary: 'Error', detail: 'Zipcode does not exist '})
  } else {
  this.signInForm.value.zipcode = country
  this.zipCodeServices = res;
  console.log(this.zipCodeServices);
  this.signInForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
  }  
  })
}
},3000);
}

zipcodeService(event) { 
    this.http.get(environment.host + 'zipcodes/serviceable/' + this.signInForm.value.zipcode.code ).subscribe((res: any) => { 
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
        } 
        else if(res.statusCode == 401 && res.errors[0] === "Invalid Zipcode"){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: ' Please enter valid Zipcode.'});
          this.loginFailed = true;
          this.loader.close();
        } else if(res.statusCode == 401 && res.errors[0] === "Enter valid address"){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter valid Address.'});
          this.loginFailed = true;
          this.loader.close();
        } else if(res.statusCode == 401 && res.errors[0] === "Email already registered with a different Pharmacy"){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Email already registered with a different Pharmacy.'});
          this.loginFailed = true;
          this.loader.close();
        }  else if(res.statusCode == 401 && res.errors[0] === "Can't get geo locations for the given address"){
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: ' Please enter valid Address.'});
          this.loginFailed = true;
          this.loader.close();
        }
        else {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Registration unsuccesfull.'});
          this.loginFailed = true;
          this.loader.close();
        }
      }, (err) => {
        this.loader.close();
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'Server error.'});
      }
      );
    } else {
      this.setFormTouched(this.signInForm);
    }
  }


  onlyValues1(event){
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode == 8|| event.keyCode == 37 || event.keyCode == 39 || event.which == 65) {
    return true;
    }else if ( key < 48 || key > 57 ) {
    return false;
    }else return true;
  };

  focusMethod(){
      this.focusGain = true;
  }

  focusMethod1(){
    this.focusGain = this.signInForm.controls['zipcode'].value ? true : false;
}

  setFormTouched(form_obj: any) {
    Object.keys(form_obj.controls).forEach(field => {
      const control = form_obj.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  password() {
    this.show = !this.show;
}


}