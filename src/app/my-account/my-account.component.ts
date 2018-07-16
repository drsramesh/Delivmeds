import { Component, OnInit } from '@angular/core';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { first, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/';
import { environment } from '../../environments/environment'
import { addUserDetails } from '../Interface/addUserDetails';
// import { PharmacyDetails } from '../Interface/pharmacydetails';
import { profilePage } from '../Interface/profilePage';
import { editUserDetails } from '../Interface/editUserDetails';
import {MultiSelectModule} from 'primeng/multiselect';
import { WeekDay } from '@angular/common';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router'
import { runInThisContext } from 'vm';
import { PreloadService } from '../services/preload.service'
import { Password } from 'primeng/primeng';



@Component({
 selector: 'app-my-account',
 templateUrl: './my-account.component.html',
 styleUrls: ['./my-account.component.css'],
 providers:[editUserDetails]
})
export class MyAccountComponent implements OnInit {
 
 filteredCountriesSingle: any=[];
 signInForm: FormGroup;
 backendDetails = [];
 backendDetails1 : any;

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
 //pharmacyDetailsTimingsArrayList : PharmacyDetails[];
 //pharmacyDeatilsTimings: PharmacyDetails;
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
 accouEdit: boolean = false;
 serviceForm: FormGroup;
 userInformation: any = []
 updatedInformation : string[] = [];
 servicesOffer = [];
 insuranceProviders = [];
 selectedServices = [];
 services= [];
 selectedInsuranceProviders = [];
 fromTime: string[] =[];
 week: WeekDay;
 week1: string[]
 previousVal: any;
 currentVal: any;
 // toTime: [ ];
 msgs = [];
 zipCodeServices: any={};
 country: any[]
 date7: Date;
 date8: Date;
 mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

 
 
 ngOnInit() {
 this.RegisteredDetailsService();
 this.serviceOfferingsService();
 this.addProviders();
 // this.zipcodeService();
 this.profilepageObj = this.userInformation
 console.log("profilePage ="+ JSON.stringify( this.profilepageObj))
 console.log("userInformation ="+ this.userInformation)
 this.editForm = this.fb.group({
 pharmacyName: new FormControl(null, Validators.required),
 phoneNo: new FormControl(null, Validators.required),
 address: new FormControl(null, Validators.required),
 street: new FormControl(null),
 zipcode: new FormControl(null, Validators.required),
 email: new FormControl(null),
 city: new FormControl(null),
 state: new FormControl(null)
 });

 
 //this.userdetails.setUser(res['user'])
 this.weekdays= [
  {
  'name':'Weekdays',
  'dayOfWeek': 5
  },
  {
  'name':'WeekEnds',
  'dayOfWeek': 2
  },
  {
  'name':'saturday',
  'dayOfWeek': 1
  },
  {
  'name':'sunday',
  'dayOfWeek': 0
  }

 ]
 
 }

 
 filterCountrySingle(event) {
 console.log(event);
 let query = event.query;
 this.http.get(environment.host + 'zipcodes/serviceable/' + this.editForm.value.zipcode ).subscribe(country => {
 if(country['statusCode']==401){
 this.filteredCountriesSingle=[];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Zipcode not available '})
 }else{
 this.filteredCountriesSingle=[]
 country['object'].forEach(country=>{
 this.filteredCountriesSingle.push({name:country,code:country})
 // this.editForm.patchValue({city: this.filterCountrySingle. ,state: this.zipCodeServices.object.state});
 
 })
 }
 
 
 })
}

zipcodeServiceTab(country) {
   
	this.http.get(environment.host + 'zipcodes/get_serviceable/' + country ).subscribe((res: any) => {
	  console.log(res);
	  
  if(res.statusCode === 401) {
  //alert('zipcode is not servicable')
  this.signInForm.patchValue({city: "" ,state: ""});
  
  } else {
	this.signInForm.value.zipcode = country
   this.zipCodeServices = res;
	console.log(this.zipCodeServices);
	this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
  }
  
	})
  }

zipcodeService(event) {
 console.log(event)
 console.log(this.editForm.value.zipcode.code);
 
 this.http.get(environment.host + 'zipcodes/get_serviceable/' + this.editForm.value.zipcode.code ).subscribe((res: any) => {
 console.log(res);
 
if(res.statusCode === 401) {
//alert('zipcode is not servicable')
this.editForm.patchValue({city: "" ,state: ""});

} else {
console.log(this.editForm.value.zipcode);
 console.log(JSON.stringify(res));
 this.zipCodeServices = res;
// this.zipcodeService.push
 console.log(this.zipCodeServices);
 this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
}

 })
}

 weekdata :string;
 weekvalue:number;
 userInfo;
 onSelectType(event) {
 if(event) {
 console.log(event['name']);
 this.weekdata = event['name'];
 this.weekvalue = event['dayOfWeek'];
 }
 console.log('Day ='+ this.weekdata);
}



 tempKeys: Array<string> = []
 tempValues: Array<string> = []
 tempValues1: Array<string> = []
 tempKeysInsurannce: Array<string> = [];
 tempTimings= [];
 updateInsurances: any = [];

 RegisteredDetailsService() {
 const header = {'authentication_token': localStorage.getItem('authentication_token')};
 console.log(header);
 console.log("auth" + localStorage.getItem ('authentication_token'));
 this.loader.open();
// 
 this.http.get(environment.host + 'pharmacy/profile', { headers: header} ).subscribe(data =>
 {
 console.log(JSON.stringify(data));
 
 this.userInformation = data;

 this.loader.close();
if(data['pharmacyBusinessHours']){
    this.userInformation.pharmacyBusinessHours.forEach(element => {
      this.addPharmacyTimingsFromBackend(element);
   })
  }
 
 if(data['pharmacyServices']){
 this.updatedInformation.push(data['pharmacyServices']);
 this.tempKeys = Object.values(this.updatedInformation[0]);
 this.tempValues = Object.keys(this.updatedInformation[0]);
 let index = this.tempValues;
 this.tempValues.forEach(element => {
   this.selectedServices.push({name:this.updatedInformation[0][element],id:element})
 });
 this.services.push()
 console.log(this.updatedInformation);
 console.log(this.tempValues)
 let ids = this.services.push
 }

 if(data['pharmacyInsuranceProviders']){
 this.updateInsurances.push(data['pharmacyInsuranceProviders'])
 this.tempKeysInsurannce = Object.values(this.updateInsurances[0]);
 this.tempValues1 = Object.keys(this.updateInsurances[0])
 let index = this.tempValues1
 this.tempValues1.forEach(element => {
	 this.selectedInsuranceProviders.push({name:this.updateInsurances[0][element],id:element})	 
 });
 console.log(this.updateInsurances);
 
 }
 
 
 this.country=this.userInformation.zipcode
console.log(this.userInformation);

 
 this.editForm.patchValue({
 pharmacyName: this.userInformation.pharmacyName,
 phoneNo: this.userInformation.phoneNo,
 email: this.userInformation.email,
 address: this.userInformation.address,
 street: this.userInformation.street,
 zipcode: {'name':this.country },
 city : this.userInformation.city,
 state: this.userInformation.state
 })
 
 });
 
 }

 serviceOfferingsService() {
 
 const header = {'authentication_token': localStorage.getItem('authentication_token')};
 this.http.get(environment.host + 'pharmacy/service_offerings', { headers: header} ).subscribe((data) =>
 {
 console.log('mydata', data);
 this.updateService.push(data['object'])
 console.log(this.updateService[0]);
 // this.updateService = data
 console.log(data) 
 this.servicesOffer.push(this.updateService[0].map((e) => { return { 'label': e.serviceName, 'value': {'name': e.serviceName,'id': e.serviceOfferingId } }
 }))
 this.servicesOffer = this.servicesOffer[0]
 console.log(this.servicesOffer);

 
 });
 }

 addUser(){
 this.user= true
 }
 accountEdit(){
 this.userInformation.pharmacyName;
 
 this.accouEdit = true
 }

 details = [];
 editUserDetails(editForm) {


 if(editForm.valid){
 const params = {
 pharmacyName: editForm.value.pharmacyName|| this.userInformation.pharmacyName,
 phoneNo: editForm.value.phoneNo || this.userInformation.phoneNo,
 address: editForm.value.address || this.userInformation.address,
 email: this.userInformation.email,
 street: editForm.value.street || this.userInformation.street,
 zipcode: editForm.value.zipcode.name || editForm.value.zipcode,
 city : editForm.value.city || this.userInformation.city,
 state: editForm.value.state || this.userInformation.state
 
 };
 this.auth.EdituserDetails(params).subscribe((res:any) => {
 console.log(params);
 console.log(res);
 this.details.push(params.pharmacyName + params.phoneNo + params.address + params.street +params.zipcode + params.city + params.state)
 this.userInformation.pharmacyName = params.pharmacyName;
 this.userInformation.phoneNo = params.phoneNo;
 this.userInformation.address = params.address;
 this.userInformation.street = params.street;
 this.userInformation.zipcode = params.zipcode;
 this.userInformation.city = params.city;
 this.userInformation.state = params.state;
 
 this.accouEdit= false
 
 });
 

 
 }  else {
  this.setFormTouched(this.editForm);
 }
}

 addService(newService : string) {
 if(newService) {
 this.updateService.push(newService);
 }
 }


 edit( ) {
 this.userInformation.pharmacyName = this.editdetails.pharmacyName;
 this.userInformation.phoneNo = this.editdetails.phoneNo;
 this.userInformation.email = this.editdetails.email;
 this.userInformation.address = this.editdetails.address;
 this.userInformation.street = this.editdetails.street;
 this.userInformation.zipcode = this.editdetails.zipcode;
 this.userInformation.city = this.editdetails.city;
 this.userInformation.bio = this.editdetails.bio;
 this.userInformation.pharmacyBusinessHours = this.editdetails.pharmacyBusinessHours;
 
 
 }

 pharmacyTiming = [];
 addPharmacy(newPharmacy: string, newPharmacy1: string, newPharmacy2: string) {
 
 if(newPharmacy == null && newPharmacy1 == null && newPharmacy2 == null){
	this.msgs.push({severity: 'error', summary: 'please enter the fields', detail: ''});
 }
 else {
 let week_time =this.weekdata
 this.currentVal = newPharmacy2;
 let hour = new Date(newPharmacy).getHours(); 
 let min = new Date(newPharmacy).getMinutes();
 let sMin = '',sMin1 = '';
if(-1< min && min<10){
	sMin = "0" +min;
}
 var ampm = hour >= 12 ? 'PM' : 'AM';
 hour = hour % 12;
 hour = hour ? hour : 12; // the hour '0' should be '12'
 this.timeValue = `${hour}:${sMin}` + " " +ampm; 
 //this.timeValue = `${hour}:${min}`

 //second field
 let hour1 = new Date(newPharmacy1).getHours();
 let min1 = new Date(newPharmacy1).getMinutes();
 if(-1< min1 && min1<10){
	sMin1 = "0" +min1;
}
 var ampm = hour1 >= 12 ? 'PM' : 'AM';
 hour1 = hour1 % 12;
 hour1 = hour1 ? hour1 : 12; // the hour '0' should be '12'
 this.timeValue1 = `${hour1}:${sMin1}` + " "+ ampm;
 //this.timeValue1 = `${hour1}:${min1}`
	console.log(this.updatePharmacy)
	let pushingElement = this.timeValue + " " + this.timeValue1 + " " + week_time;
	let index = this.updatePharmacy.indexOf(pushingElement);

	if (index == -1)
	{
		let obj = {
			dayOfWeek: this.weekvalue,
			opens: this.timeValue,
			closes: this.timeValue1
			}
		this.updatePharmacy.push(pushingElement);
		this.pharmacyTiming.push(obj)
		
	}	 
	   else {
		this.msgs.push({severity: 'error', summary: 'Time slot already exist', detail: ''});
	}
 }
 }

 addPharmacyTimingsFromBackend(input){
	
	console.log(input);
	
	let arr = this.weekdays.filter((e)=> {
		if (e['dayOfWeek'] == input['dayOfWeek']) 
		{
			console.log("coming")
			return e['name']
		} 		
	 })
		let obj = {
			dayOfWeek: arr[0]["name"],
			opens: input['opens'],
			closes: input['closes']
		}	 
		let pushingElement = obj.opens + " " + obj.closes + " " + obj.dayOfWeek;
		let index = this.updatePharmacy.indexOf(pushingElement);
		if (index == -1)
		{
			 this.updatePharmacy.push(pushingElement);
			 
		}	else {
			this.msgs.push({severity: 'error', summary: 'Time slot already entered', detail: ''});
		}	
 }
 deleteUser(index){
 let i = this.addNewUser.indexOf
 this.addNewUser.splice(index,1)

 }

 deleteUser1(index){
	let i = this.userInformation.pharmacyUsers.indexOf
	this.userInformation.pharmacyUsers.splice(index,1)
	this.users.splice(index,1)
   
	}

 deletePharmacyTimings(index) {
 let i = this.updatePharmacy.indexOf
 this.updatePharmacy.splice(index,1)
 this.userInformation.pharmacyBusinessHours.splice(index,1)
 this.pharmacyarrays.splice(index,1)
 }

 deletePharmacyTimings1(index) {
 let i = this.userInformation.pharmacyBusinessHours.indexOf
 // this.updatePharmacy.splice(index,1)
 this.userInformation.pharmacyBusinessHours.splice(index,1)
 this.pharmacyarrays.splice(index,1)
 
 }

 
 
 //update complete details
 aboutPharmacy: string;
 submitDetails(details) {
 
 console.log(this.pharmacyTiming)
 
 let ids = this.selectedServices.map((e)=> {return e['id']})
 let insuranceIds = this.selectedInsuranceProviders.map((e) => {return e['id']})
 
 
 let profilepageObj = {
 pharmacyName : this.userInformation.pharmacyName,
 phoneNo : this.userInformation.phoneNo,
 bio: this.aboutPharmacy,
 pharmacyBusinessHours: this.pharmacyTiming,
 pharmacyServices: ids ,
 pharmacyInsuranceProviders: insuranceIds,
 delivery: this.checkboxvalue,
 pickup: this.checkboxvalue1,
 pharmacyUsers: this.newUserDetails
 

 };

 console.log(profilepageObj);
 this.loader.open();
 if(this.userInformation.pickup == false || this.userInformation.delivery == false){
	this.msgs.push({severity: 'error', summary: 'Error', detail: 'please provide atleast one Delivery details'});
 } else if(this.pharmacyTiming == []){
	this.msgs.push({severity: 'error', summary: 'Error', detail: 'please provide atleast one pharmacy Timing details'});
 }
 else{
 this.auth.updateDetails(profilepageObj).subscribe((res: any) => {
 
 if (res.statusCode == 200) {
 this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
 this.loader.close();
 this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
 this.router.navigate(['/orders']);
 
 } 
 else if(res.statusCode == 400){
 this.msgs.push({severity: 'error', summary: ' Please enter services are not entered', detail: 'Update unsuccesfull'});
 this.loader.close(); 
 }
 
 else {
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Update unsuccesfull'});
 this.loader.close();
 }
 }, (err) => {
 this.loader.close();
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
 }
 );
}
 }

ids1 = [];
 pharmacyarrays= [];
 users =[];

 updateDetails() {
 let id = this.selectedServices.map((e)=> {return e['id']})
 let insuranceId = this.selectedInsuranceProviders.map((e) => {return e['id']}) 

 let constantbio = this.aboutPharmacy || ''
 let constantTimings = this.pharmacyTiming 
 let constantIds = id || []
 let constantsInsuranceIds = insuranceId || []
 let deliverychanged = this.checkboxvalue || ''
 let pickupchanged = this.checkboxvalue1 || ''
 let constantUsers = this.newUserDetails || ''
 let tempids = [] ;
 let tempids1 = [];

 
 if(this.tempKeys.length >0 ){
 tempids = this.tempValues.map((e => { 
 return parseInt(e)
 }))
}

console.log(this.tempKeysInsurannce)
console.log(this.tempValues1)
if(this.tempKeysInsurannce.length>0 ){
 tempids1 = this.tempValues1.map((e => {
 return parseInt(e)
 }))
}

 this. users = this.userInformation.pharmacyUsers || ''
 this. pharmacyarrays = this.userInformation.pharmacyBusinessHours || [];
 let profilepageObj = {
 pharmacyName : this.userInformation.pharmacyName || this.editForm.value.pharmacyName,
 phoneNo : this.userInformation.phoneNo || this.editForm.value.phoneNo1,
 bio: constantbio,
 pharmacyBusinessHours: this.pharmacyTiming.concat(this.pharmacyarrays),
pharmacyServices: id,
pharmacyInsuranceProviders: insuranceId,
 delivery:this.userInformation.delivery,
 pickup: this.userInformation.pickup,
 pharmacyUsers: this.users.concat(constantUsers)

 };


 console.log(this.pharmacyarrays);
 console.log(this.pharmacyTiming);
 
 
 console.log(this.pharmacyarrays != []);
 console.log(this.pharmacyTiming != []);
//  if(this.userInformation.pickup == false || this.userInformation.delivery == false){
// 	this.msgs.push({severity: 'error', summary: 'Error', detail: 'please provide atleast one Delivery details'});

//   } else 
if (this.pharmacyTiming == []) {
 	this.msgs.push({severity: 'error', summary: 'Error', detail: 'please provide atleast one Timing details'});
  }
 else {
 this.auth.updateDetails(profilepageObj).subscribe((res: any) => {
 console.log
 if (res.statusCode == 200) {
 this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
 this.loader.close();
 this.router.navigate(['/orders']);
 
 } 
 else if(res.statusCode == 400){
 this.msgs.push({severity: 'error', summary: 'Please select Services offer  ', detail: 'Update unsuccessfull'});
 this.loader.close(); 
 }
 
 else {
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Update unsuccesfull'});
 this.loader.close();
 }
 }, (err) => {
 this.loader.close();
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
 }
 );
}
 }


 deleteService(index) {
 console.log(index);
 let i = this.selectedServices.indexOf
 let j = this.servicesOffer.indexOf
 this.selectedServices.splice(index,1)
 // this.servicesOffer.splice(index,1)

 }
 
 deletedService = [];
 deleteService1(index) {
 console.log(index);
 let i = this.tempKeys.indexOf
 // let j = this.servicesOffer.indexOf
 this.tempKeys.splice(index,1)
 this.tempValues.splice(index,1)
//  this.servicesOffer.splice(index,1)
  this.selectedServices.splice(index,1)
  // this.selectedServices.push()
//  this.deletedService.push(index,1)
 console.log(this.deletedService);
 

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
 deletedProvide = [];

 deleteProvider1(index) {
 
 let i = this.tempKeysInsurannce.indexOf
 this.tempKeysInsurannce.splice(index,1);
 //this.selectedInsuranceProviders.splice(index,1);
 this.tempValues1.splice(index,1)
 this.insuranceProviders.splice(index,1);
 //console.log(this.insuranceProviders);
 console.log(this.insuranceProviders.splice(index,1));
 console.log(this.deletedProvide);
 
 
 }


 newUserDetails = [];
 addButtonclicked(signInForm) {
 
 if (signInForm.valid) {
 const params = {
   email: this.userInformation.email,
  pharmacyUserEmail: signInForm.value.signinEmail,
 password: signInForm.value.signinPassword,
 firstName: signInForm.value.firstName,
 lastName: signInForm.value.lastName
 };
 
 this.newUserDetails.push(params.email + " "+ params.password + " " + params.firstName + " "+ params.lastName)
 
 console.log(params);
 this.auth.newUser(params).subscribe((res:any) => {
 console.log(params);
 console.log(res);
 if(res.statusCode == 200){
  this.addNewUser.push(params.firstName + " " + params.lastName);
 }else {
  this.msgs.push({severity: 'error', summary: 'Error', detail: 'Email already registered'});
 }
 });
 
 this.user= false
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
cancelButtonClicked() {

 console.log("cancel button is clicked");
 
}

addProviders(){
 const header = {'authentication_token': localStorage.getItem ('authentication_token')};
 this.http.get(environment.host + 'insurance_providers/', { headers: header}).subscribe((data) =>
 {
 console.log('mydata', data);
 this.updateInsuranceProvider.push(data['object'])
 console.log(this.updateInsuranceProvider[0]);
 this.insuranceProviders.push(this.updateInsuranceProvider[0].map((e) => { return { 'label': e.providerName, 'value': {'name': e.providerName,'id': e.id }}
 }))
 this.insuranceProviders = this.insuranceProviders[0]

 
 
 })
}
}
