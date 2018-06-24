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
import { Router } from '@angular/router'
import { runInThisContext } from 'vm';
import { PreloadService } from '../services/preload.service'



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  providers:[editUserDetails]
})
export class MyAccountComponent implements OnInit {
 
  signInForm: FormGroup;

  SignUpForm : FormGroup;
  editForm: FormGroup;
  checkboxvalue: boolean;
  checkboxvalue1: boolean;
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
  pharmacyname: string[];
    
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private auth: DelivMedsAuthService,
    private router: Router,
    private editdetails: editUserDetails,
    private loader: PreloadService,
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
  msgs = [];
  zipCodeServices: any={};
  
  
  ngOnInit() {
    this.RegisteredDetailsService();
    this.serviceOfferingsService();
    this.addProviders();
    this.profilepageObj = this.userInformation
    console.log("profilePage ="+ JSON.stringify( this.profilepageObj))
    console.log("userInformation ="+ this.userInformation)
    this.editForm = this.fb.group({
      businessName: new FormControl(null, Validators.required),
      phoneNo1: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      zipcode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required)
//       inemail: ["", [   [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
//         Validators.required],
//       this.isEmailUnique.bind(this) // async Validator passed as 3rd parameter 
//  ],
       });

   
    //this.userdetails.setUser(res['user'])
    this.weekdays= [
      {
        'name':'Week days',
      },
      {
        'name':'Week ends',
      },
      {
        'name':'Saturday',
      },
      {
        'name':'Sunday',
      }
    ]
    
  }
   weekdata :string;
  
   onSelectType(event) {
    if(event) {
       console.log(event['name']);
        this.weekdata = event['name'];
    }
    console.log('Day ='+ this.weekdata);
}

  RegisteredDetailsService() {
    const header = {'authentication_token': localStorage.getItem('authentication_token')};
    console.log(header);
    console.log("auth" + localStorage.getItem ('authentication_token'));
    this.http.get(environment.host + 'pharmacy/profile', { headers: header} ).subscribe(data =>
    {
      console.log(JSON.stringify(data));
   this.userInformation = data;
    console.log(this.userInformation);
    this.editForm.patchValue({
      businessName: this.userInformation.pharmacyName,
      phoneNo1: this.userInformation.phoneNo,
      address: this.userInformation.address,
      street: this.userInformation.street,
      zipcode: this.userInformation.zipcode,
      city : this.userInformation.city,
      state: this.userInformation.state
    })
  
    });
    
  }

  zipcodeService() {
    console.log(this.editForm.value.zipcode);
    
    this.http.get(environment.host + 'zipcodes/get_serviceable/' + this.editForm.value.zipcode ).subscribe((res: any) => {
      console.log(res);
      
if(res.statusCode === 401) {
  //alert('zipcode is not servicable')
  this.msgs.push({severity: 'error', summary: 'Error', detail: 'zipcode not available '});
  this.editForm.patchValue({city: "" ,state: ""});

} else {
  console.log(this.editForm.value.zipcode);
      console.log(JSON.stringify(res));
   this.zipCodeServices = res;
   
  // this.zipcodeService.push
    console.log(this.zipCodeServices);
    this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
    console.log( this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state}));
    
}

    })
  }


  serviceOfferingsService() {
   
    const header = {'authentication_token': localStorage.getItem('authentication_token')};
    this.http.get(environment.host + 'pharmacy/service_offerings',  { headers: header} ).subscribe((data) =>
    {
      console.log('mydata', data);
      this.updateService.push(data['object'])
      console.log(this.updateService[0]);
      // this.updateService = data
      console.log(data)
      this.servicesOffer.push(this.updateService[0].map((e) => {  return { 'label': e.serviceName, 'value': {'name': e.serviceName,'id': e.serviceOfferingId }  }
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
    this.userInformation.pharmacyName;
    // console.log(this.userInformation.pharmacyName)
    // console.log(this.editdetails.pharmacyName)
    // this.editdetails.pharmacyName = this.userInformation.pharmacyName;
    //  this.userInformation.phoneNo = this.editdetails.phoneNo;
    //   this.userInformation.email = this.editdetails.email;
    //   this.userInformation.address = this.editdetails.address;
    //   this.userInformation.street = this.editdetails.street;
    //   this.userInformation.zipcode = this.editdetails.zipcode;
    //   this.userInformation.city = this.editdetails.city;
   // this.RegisteredDetailsService();
    //this.editdetails.phoneNo = this.userInformation.phoneNo;
    // this.editdetails.email = this.userInformation.email;
    // this.editdetails.phoneNo = this.userInformation.phoneNo;
    // this.editdetails.address = this.userInformation.address;
    // this.editdetails.street = this.userInformation.street;
    // this.editdetails.zipcode = this.userInformation.zipcode;
    // this.editdetails.city = this.userInformation.city;
    // this.editdetails.bio = this.userInformation.bio;
    this.accouEdit = true
  }

  //userdetials
  // editUserDetails( ) {
  //   this.userInformation.pharmacyName = this.editdetails.pharmacyName;
  //   this.userInformation.phoneNo = this.editdetails.phoneNo;
  //    this.userInformation.email = this.editdetails.email;
  //    this.userInformation.address = this.editdetails.address;
  //    this.userInformation.street = this.editdetails.street;
  //    this.userInformation.zipcode = this.editdetails.zipcode;
  //    this.userInformation.city = this.editdetails.city;
  //    this.userInformation.bio = this.editdetails.bio;
     
  //   this.accouEdit= false
  //    }
  details = [];
  editUserDetails(editForm) {


    if(editForm.valid){
    const params = {
      businessName: editForm.value.businessName,
      phoneNo1: editForm.value.phoneNo1,
      address: editForm.value.address,
      street: editForm.value.street,
      zipcode: editForm.value.zipcode,
      city : editForm.value.city,
      state: editForm.value.state
      
    };
    console.log(this.editForm.value);
    
    
    this.details.push(params.businessName + params.phoneNo1 + params.address + params.street +params.zipcode + params.city + params.state)
    this.userInformation.pharmacyName = params.businessName;
    this.userInformation.phoneNo = params.phoneNo1;
    this.userInformation.address = params.address;
    this.userInformation.street = params.street;
    this.userInformation.zipcode = params.zipcode;
    this.userInformation.city = params.city;
    this.userInformation.state = params.state;
   
    this.accouEdit= false
    console.log(this.userInformation);
    
  }
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
      console.log(newPharmacy2)
      let week_time =this.weekdata
      this.currentVal = newPharmacy2;
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
      this.updatePharmacy.push(this.timeValue + "  " + this.timeValue1  + "  " + week_time);
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
    let ids = this.selectedServices.map((e)=> {return e['id']})
    let insuranceids = this.selectedInsuranceProviders
  
   let  profilepageObj = {
     pharmacyName : this.userInformation.pharmacyName,
     phoneNo :  this.userInformation.phoneNo,
     bio: this.editdetails.bio,
     services: ids,
    address: this.userInformation.address,
    street: this.userInformation.street,
    zipcode: this.userInformation.zipcode,
    city: this.userInformation.city,
    pharmacyUsers: this.addNewUser,
    pharmacyBusinessHours: this.updatePharmacy,
    delivery: this.checkboxvalue,
    pickup: this.checkboxvalue1
    
     //services: [2,3,5]

   };
   this.loader.open();
   this.auth.updateDetails(profilepageObj).subscribe((res: any) => {
    console.log(res.statusCode);
    if (res.statusCode == 200) {
      console.log(res.statusCode);
      this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
      //alert("success");
       this.loader.close();
      //  this.tokenService.storeTokens(
      //    res['authentication_token'],
      //    res['refresh_token'],
      //  );
      // this.user.createUser(res['user']);
     //  console.log(res['user']);
      this.router.navigate(['/orders']);
      
      // this._redirection.navigateToDefaultRoute(res["user"]["role"]);
    } 
    else if(res.statusCode == 400){
      console.log(res.statusCode);
      this.msgs.push({severity: 'error', summary: 'Either pharmacy Name or Phone Number or List of services are not entered', detail: 'Update unsuccesfull'});
      //alert("Either phrmacyName or Phone Number or List of services are not entered ")
      
    }
    
    else {
      this.msgs.push({severity: 'error', summary: 'Error', detail: 'Update  unsuccesfull'});
     // this.loginFailed = true;
     // this.toasts.error(res["message"], "Oops!", { 'showCloseButton': true });
      //alert("failure");
      console.log(res.statusCode);
      //this.loader.close();
    }
  }, (err) => {
   // this.loader.close();
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
    // this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
    // alert("server error");
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
     //this.servicesOffer.splice(index,1)

  }


  deleteProvider(index) {
   
    let i = this.selectedInsuranceProviders.indexOf
    let j = this.insuranceProviders.indexOf
    console.log(j)
      this.selectedInsuranceProviders.splice(index,1);
     // this.insuranceProviders.splice(index,1);
      //console.log(this.insuranceProviders);
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
  const header = {'authentication_token': localStorage.getItem ('authentication_token') ,  'Content-Type': 'application/json; charset=UTF-8',
  "Access-Control-Allow-Origin": '*'};
   this.http.get(environment.host + 'insurance_providers/',  { headers: header}).subscribe((data) =>
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

