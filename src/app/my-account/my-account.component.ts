import { Component, OnInit } from '@angular/core';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/observable';
import { environment } from  '../../environments/environment'
import { addUserDetails } from '../Interface/addUserDetails';
import {  PharmacyDetails } from '../Interface/pharmacydetails';
import { profilePage } from '../Interface/profilePage';
import { editUserDetails } from '../Interface/editUserDetails';
import {MultiSelectModule} from 'primeng/multiselect';
import { WeekDay } from '@angular/common';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  providers:[editUserDetails]
})
export class MyAccountComponent implements OnInit {
 
  signInForm: FormGroup;
  value: Date;
  value1: Date;
  timeValue: string;
  timeValue1: string;
  weekdays : any[];
  serviceName : string;
  updateService: any = [];
  updateInsuranceProvider= [];
  updatePharmacy = [];
  addNewUser: any = [];
  pharmacyDetailsTimingsArrayList : PharmacyDetails[];
  pharmacyDeatilsTimings: PharmacyDetails;
  profilepageObj = profilePage;
  pharmacyname: string;
    
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private auth: DelivMedsAuthService,
    private editdetails: editUserDetails,
    private userdetails: UserService,) {
      this.signInForm = this.fb.group({
        signinEmail: new FormControl(null, Validators.required),
        signinPassword: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required)
      });
   }
  user: boolean = false;
  accouEdit:  boolean = false;
  serviceForm: FormGroup;
  userInformation: any = [];
  updatedInformation:any[];
  servicesOffer = [];
  insuranceProviders = [];
  selectedServices: string[] = [];
  selectedInsuranceProviders: string[] = [];
  fromTime: string[] =[];
  week: WeekDay;
  week1: string[]
  previousVal: any;
  currentVal: any;
  // toTime: [ ];
  
  
  ngOnInit() {
    this.RegisteredDetailsService();
    this.serviceOfferingsService();
    this.addProviders();
    this.profilepageObj = this.userInformation
    console.log("profilePage ="+ JSON.stringify( this.profilepageObj))
    console.log("userInformation ="+ this.userInformation)

   
    //this.userdetails.setUser(res['user'])
    this.weekdays= [
      {
        'name':'Daily',
      },
      {
        'name':'Weekdays only',
      },
      {
        'name':'Saturday',
      },
      {
        'name':'Sunday',
      }
    ]
    
  }

  onSelectType(event) {
    if(event) {
        this.previousVal = this.currentVal;
        this.currentVal = event;
    }
    console.log('this.previousVal', this.previousVal);
    console.log('this.currentVal', this.currentVal);
}

  RegisteredDetailsService() {
    const header = {'authentication_token': localStorage.getItem('authentication_token')};
    console.log(header);
    console.log("auth" + localStorage.getItem ('authentication_token'));
    
    this.http.get(environment.host + '/pharmacy/profile', { headers: header} ).subscribe(data =>
    {
      console.log(JSON.stringify(data));
   this.userInformation = data;
    console.log(this.userInformation);
  
    });
    
  }

  serviceOfferingsService() {
   
    const header = {'authentication_token': localStorage.getItem('authentication_token')};
    this.http.get(environment.host + '/pharmacy/service_offerings', { headers: header} ).subscribe((data) =>
    {
      console.log('mydata', data);
      this.updateService.push(data['object'])
      console.log(this.updateService[0]);
      // this.updateService = data
      console.log(data)
      this.servicesOffer.push(this.updateService[0].map((e) => {  return { 'label': e.serviceName, 'value': e.serviceName }
    }))
    this.servicesOffer = this.servicesOffer[0]
    console.log(this.servicesOffer);
   // this.servicesOffer.push(this.listOfService['value']);

    
    });
  }

  addUser(){
    this.user= true
  }
  accountEdit(){
    this.editdetails.pharmacyName = this.userInformation.pharmacyName;
    this.editdetails.phoneNo = this.userInformation.phoneNo;
    this.editdetails.email = this.userInformation.email;
    this.editdetails.phoneNo = this.userInformation.phoneNo;
    this.editdetails.address = this.userInformation.address;
    this.editdetails.street = this.userInformation.street;
    this.editdetails.zipcode = this.userInformation.zipcode;
    this.editdetails.city = this.userInformation.city;
    this.accouEdit = true
  }

  //userdetials
  editUserDetails( ) {
    this.userInformation.pharmacyName = this.editdetails.pharmacyName;
    this.userInformation.phoneNo = this.editdetails.phoneNo;
     this.userInformation.email = this.editdetails.email;
     this.userInformation.address = this.editdetails.address;
     this.userInformation.street = this.editdetails.street;
     this.userInformation.zipcode = this.editdetails.zipcode;
     this.userInformation.city = this.editdetails.city;
     
    this.accouEdit= false
     }

  addService(newService : string) {
    if(newService) {
      this.updateService.push(newService);
    }
  }

  // onSelect($event) {
  //   let hour = new Date($event).getHours();
  //   let min = new Date($event).getMinutes();
  //   this.timeValue = `${hour}:${min}`;
  //   //this.updatePharmacy.push(this.timeValue);
  // }

  edit( ) {
    this.userInformation.pharmacyName = this.editdetails.pharmacyName;
    this.userInformation.phoneNo = this.editdetails.phoneNo;
     this.userInformation.email = this.editdetails.email;
     this.userInformation.address = this.editdetails.address;
     this.userInformation.street = this.editdetails.street;
     this.userInformation.zipcode = this.editdetails.zipcode;
     this.userInformation.city = this.editdetails.city;
     
    // this.accouEdit= false
     }

  addPharmacy(newPharmacy: string, newPharmacy1: string, newPharmacy2: string) {
      console.log(newPharmacy)
      console.log(newPharmacy1)
      let hour = new Date(newPharmacy).getHours();  
      let min = new Date(newPharmacy).getMinutes();
      var ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      this.timeValue = `${hour}:${min}` + ampm; 
  //second field
    let  hour1 = new Date(newPharmacy1).getHours();
     let min1 = new Date(newPharmacy1).getMinutes();
     var ampm = hour1 >= 12 ? 'PM' : 'AM';
      hour1 = hour1 % 12;
      hour1 = hour1 ? hour1 : 12; // the hour '0' should be '12'
     this.timeValue1 =  `${hour1}:${min1}` + ampm;
      this.updatePharmacy.push(this.timeValue + " " + this.timeValue1 );
  }

  deleteUser(index){
    let i = this.addNewUser.indexOf
    this.addNewUser.splice(index,1)

  }

  deletePharmacyTimings(index) {
    let i = this.updatePharmacy.indexOf
    this.updatePharmacy.splice(index,1)
  }

 //update complete details
 updateDetails(details) {
   const  profilepageObj = {
     pharmacyName : this.userInformation.pharmacyName,
    phoneNo :  this.editdetails.phoneNo,
     email : this.editdetails.email,
     address : this.editdetails.address,
     street : this.editdetails.street,
     zipcode : this.editdetails.zipcode,
     city : this.editdetails.city,

   };
   
   this.auth.updateDetails(profilepageObj).subscribe((res: any) => {
    if (res.statusCode == 200) {
      console.log(res);
     // this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully Registered.'});
      alert("success");
      // this.loader.close();
      //  this.tokenService.storeTokens(
      //    res['authentication_token'],
      //    res['refresh_token'],
      //  );
      // this.user.createUser(res['user']);
     //  console.log(res['user']);
     // this.router.navigate(['/login']);
      
      // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
    } else if(res.statusCode != 200){
     // this.msgs.push({severity: 'error', summary: 'Error', detail: 'already registered '});
     // this.loginFailed = true;
      //this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
      alert("failure");
     //this.loader.close();
    }
    else {
     // this.msgs.push({severity: 'error', summary: 'Error', detail: 'registration unsuccesfull'});
     // this.loginFailed = true;
     // this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
      alert("failure");
      //this.loader.close();
    }
  }, (err) => {
   // this.loader.close();
   // this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
    // this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
     alert("server error");
  }
  );
   }

  // const header = {'authentication_token': localStorage.getItem('authentication_token')};
  // console.log(header);
  // console.log("auth" + localStorage.getItem ('authentication_token'));
  
  //  console.log("details updated");
  //  console.log(this.profilepageObj)
  //  console.log(this.accountEdit)
  //  this.http.post(environment.host + 'pharmacy/profile',  this.edit).subscribe(data =>
  //   {
  //     console.log(JSON.stringify(data));
  //  this.editdetails = data as any ;
  //  console.log(data)
  //   console.log(this.editdetails);
  
  //   })



  deleteService(index) {
    console.log(index);
    let i = this.selectedServices.indexOf
    let j = this.servicesOffer.indexOf
     this.selectedServices.splice(index,1)
     this.servicesOffer.splice(index,1)

  }


  deleteProvider(index) {
   
    let i = this.selectedInsuranceProviders.indexOf
    let j = this.insuranceProviders.indexOf
    console.log(j)
      this.selectedInsuranceProviders.splice(index,1);
      this.insuranceProviders.splice(index,1);
      console.log(this.insuranceProviders);
      console.log(this.insuranceProviders.splice(index,1));
      
  }
  addButtonclicked(signInForm) {
 
    if (signInForm.valid) {
      const params = {
        email: signInForm.value.signinEmail,
        password: signInForm.value.signinPassword,
        firstname: signInForm.value.firstName,
        lastName: signInForm.value.lastName
      };
       this.addNewUser.push(params.firstname + " " + params.lastName);
       
      this.user= false
      console.log(this.addNewUser)
      
    console.log("add button is clicked");
    
  }
}

cancelButtonClicked() {

  console.log("cancel button is clicked");
  
}

addProviders(){
  const header = {'authentication_token': localStorage.getItem ('authentication_token')};
   this.http.get(environment.host + '/insurance_providers/', { headers: header} ).subscribe((data) =>
  {
    console.log('mydata', data);
    this.updateInsuranceProvider.push(data['object'])
    console.log(this.updateInsuranceProvider[0]);
    
    this.insuranceProviders.push(this.updateInsuranceProvider[0].map((e) => {  return { 'label': e.providerName, 'value': e.providerName }
     }))
     this.insuranceProviders = this.insuranceProviders[0]
     console.log(this.insuranceProviders);
     
    
  })
}

// addServices()  {
//   const header = {'authentication_token': localStorage.getItem ('authentication_token')};
//   console.log(header)
//    this.http.get(environment.host + '/pharmacy/service_offerings', { headers: header} ).subscribe((data) =>
//   {
//     console.log('mydata', data);
//     this.updateService.push(data['object'])
//     console.log(this.updateService[0]);
//     // this.updateService = data
//     console.log(data)
//     this.details.push(this.updateService[0].map((e) => {  return { 'label': e.serviceName, 'value': e.serviceName }
//   }))
//   this.details = this.details[0]
//   console.log(this.details);
  
//   })
//    }
}

