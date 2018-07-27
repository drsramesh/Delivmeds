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
import {MessageService} from 'primeng/components/common/messageservice';



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
 private userdetails: UserService,
 private messageService: MessageService) {
 this.signInForm = this.fb.group({
 signinEmail: new FormControl(null, Validators.required),
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
 previousVal: any;
 currentVal: any;
 // toTime: [ ];
 msgs = [];
 zipCodeServices: any={};
 country: any[]
 date7: any;
 date8: any;
 mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

 
 
 ngOnInit() {
 this.RegisteredDetailsService();
 this.serviceOfferingsService();
 this.addProviders();
 // this.zipcodeService();
 this.profilepageObj = this.userInformation
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
  'name':'Sunday',
  'dayOfWeek': 1
  },
 
  {
	'name':'Monday',
	'dayOfWeek': 2
  },
  {
	'name':'Tuesday',
	'dayOfWeek': 3
  },
  {
	'name':'Wednesday',
	'dayOfWeek': 4
   },
   {
	'name':'Thursday',
	'dayOfWeek': 5
},
{
	'name':'Friday',
	'dayOfWeek': 6
},
{
	'name':'Saturday',
	'dayOfWeek': 7
},
{
    'name':'Weekdays',
	'dayOfWeek': 8
},
{
	'name':'WeekEnds',
	'dayOfWeek': 9
},
{
	'name':'Complete Week',
	'dayOfWeek': 10
},

 ]
 
 }

 
 filterCountrySingle(event) {
 let query = event.query;
 this.http.get(environment.host + 'zipcodes/serviceable/' + this.editForm.value.zipcode ).subscribe(country => {
 if(country['statusCode']==401){
 this.filteredCountriesSingle=[];
 this.msgs = [];
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

	  
  if(res.statusCode === 401) {
  //alert('zipcode is not servicable')
  this.signInForm.patchValue({city: "" ,state: ""});
  
  } else {
	this.signInForm.value.zipcode = country
   this.zipCodeServices = res;
	this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
  }
  
	})
  }

zipcodeService(event) {
 
 this.http.get(environment.host + 'zipcodes/get_serviceable/' + this.editForm.value.zipcode.code ).subscribe((res: any) => {
if(res.statusCode === 401) {
//alert('zipcode is not servicable')
this.editForm.patchValue({city: "" ,state: ""});

} else {
 this.zipCodeServices = res;
 this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
}

 })
}

 weekdata :string;
 weekvalue:number;
 userInfo;
 onSelectType(event) {
 if(event) {

 this.weekdata = event['name'];
 this.weekvalue = event['dayOfWeek'];
 }
}



 tempKeys: Array<string> = []
 tempValues: Array<string> = []
 tempValues1: Array<string> = []
 tempKeysInsurannce: Array<string> = [];
 tempTimings= [];
 updateInsurances: any = [];

 RegisteredDetailsService() {
 const header = {'authentication_token': localStorage.getItem('authentication_token')};
 this.loader.open();
 this.http.get(environment.host + 'pharmacy/profile', { headers: header} ).subscribe(data =>
 {
 
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
 }
 
 
 this.country=this.userInformation.zipcode
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
 this.updateService.push(data['object'])
 // this.updateService = data
 this.servicesOffer.push(this.updateService[0].map((e) => { return { 'label': e.serviceName, 'value': {'name': e.serviceName,'id': e.serviceOfferingId } }
 }))
 this.servicesOffer = this.servicesOffer[0]
 });
 }

 addUser(){
 this.user= true
 }
 accountEdit(){
	this.country=this.userInformation.zipcode
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
 street: editForm.value.street,
 zipcode: editForm.value.zipcode.name || editForm.value.zipcode,
 city : editForm.value.city || this.userInformation.city,
 state: editForm.value.state || this.userInformation.state
 
 };
 this.auth.EdituserDetails(params).subscribe((res:any) => {
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
 if(!((newPharmacy) && (newPharmacy1 ) && (newPharmacy2))){
	this.msgs = [];
	this.msgs.push({severity: 'error', summary: 'Error', detail: 'please enter the Pharmacy Timings'});
 } 
 else {
 let week_time =this.weekdata
 let currentVal = newPharmacy2
 let hour = new Date(newPharmacy).getHours(); 
 let min = new Date(newPharmacy).getMinutes();
 let sMin = '',sMin1 = '';
if(-1< min && min<10){
	sMin = "0" +min;
}else {
	sMin = min + ''
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
}else {
	sMin1 = min1 + ''
}
 var ampm = hour1 >= 12 ? 'PM' : 'AM';
 hour1 = hour1 % 12;
 hour1 = hour1 ? hour1 : 12; // the hour '0' should be '12'
 this.timeValue1 = `${hour1}:${sMin1}` + " "+ ampm;
	let pushingElement = this.timeValue + " to " + this.timeValue1 + " ; " + week_time;
	if(this.timeValue1<= this.timeValue){
		this.msgs = [];
		// this.msgs.push({severity: 'error', summary: 'To Time is less than From Time', detail: ''});
		this.msgs.push({severity: 'error', summary: 'Error', detail: 'To Time must be greater than From Time'});
	} else {
	
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
		
this.date7 =""
this.date8 =""
this.week = this.weekdays[8]	

	}	 
	   else {
		this.msgs = [];
		this.msgs.push({severity: 'error', summary: 'Error', detail: 'Time slot already exist'});
this.date7 =""
this.date8 =""	
 this.week = this.weekdays[0]
	}
 }
}
 }

 addPharmacyTimingsFromBackend(input){
	
	let arr = this.weekdays.filter((e)=> {
		if (e['dayOfWeek'] == input['dayOfWeek']) 
		{

			return e['name']
		} 		
	 })
		let obj = {
			dayOfWeek: arr[0]["name"],
			opens: input['opens'],
			closes: input['closes']
		}	 
		let pushingElement = obj.opens + " to " + obj.closes + " ; " + obj.dayOfWeek;
		let index = this.updatePharmacy.indexOf(pushingElement);
		if (index == -1)
		{
			 this.updatePharmacy.push(pushingElement);
			 
		}	else {
			this.msgs = [];
			this.msgs.push({severity: 'error', summary: 'Error', detail: 'Time slot already exist'});
			this.date7 =""
			this.date8 =""	
			 this.week = this.weekdays[0]
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
 this.pharmacyTiming.splice(index,1);
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
 let ids = this.selectedServices.map((e)=> {return e['id']})
 let insuranceIds = this.selectedInsuranceProviders.map((e) => {return e['id']})
 
 
 let profilepageObj = {
 pharmacyName : this.userInformation.pharmacyName,
 phoneNo : this.userInformation.phoneNo,
 bio: this.aboutPharmacy || '',
 pharmacyBusinessHours: this.pharmacyTiming,
 pharmacyServices: ids ,
 pharmacyInsuranceProviders: insuranceIds,
  delivery:this.userInformation.delivery,
 pickup: this.userInformation.pickup,
 pharmacyUsers: this.newUserDetails
 };
 if(this.userInformation.pickup == false && this.userInformation.delivery == false){
	 this.msgs = [];
	this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please provide atleast one Delivery type'});
 } 
 else if (this.pharmacyTiming.length <1 ) {
	this.msgs = [];
	this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please provide atleast one Pharmacy Timing details'});
 }
 else{
 this.auth.updateDetails(profilepageObj).subscribe((res: any) => {
 
 if (res.statusCode == 200) {
 this.loader.close();
 this.msgs = [];
//  this.msgs.push({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
  
  this.router.navigate(['/orders']);
  this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
 } 

 else if(res.statusCode == 400){
	this.msgs = [];
 this.msgs.push({severity: 'error', summary: ' Please provide atleast one Service offered', detail: 'Update unsuccessful'});
 this.loader.close(); 
 }
 }, (err) => {
 this.loader.close();
 this.msgs = [];
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
 
  if(this.userInformation.pickup === false && this.userInformation.delivery === false){
	this.msgs = [];
	 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please provide atleast one Delivery Type'}); 
  }  else if (this.pharmacyTiming.length <1 && this.userInformation.pharmacyBusinessHours.length<1 && this.userInformation.pharmacyBusinessHours.length == 0 && this.pharmacyTiming.length) {
		this.msgs = [];
  	this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please provide atleast one Pharmacy Timing details'});
   } else {
 this.auth.updateDetails(profilepageObj).subscribe((res: any) => {
 if (res.statusCode == 200) {
	this.loader.close();
	this.msgs = [];
	
	this.router.navigate(['/orders']);
	this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully updated.'});
 
 }  else if(res.statusCode == 400){
	this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Please provide atleast one  Service Offer  ', detail: 'Update unsuccessful'});
 this.loader.close(); 
 }
 }, (err) => {
 this.loader.close();
 this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'server error'});
 }
 );
}
 }


 deleteService(index) {
 let i = this.selectedServices.indexOf
 let j = this.servicesOffer.indexOf
 this.selectedServices.splice(index,1)

 }
 
 deletedService = [];
 deleteService1(index) {
 let i = this.tempKeys.indexOf
 this.tempKeys.splice(index,1)
 this.tempValues.splice(index,1)
  this.selectedServices.splice(index,1)
 

 }


 deleteProvider(index) {
 
 let i = this.selectedInsuranceProviders.indexOf
 let j = this.insuranceProviders.indexOf
 this.selectedInsuranceProviders.splice(index,1);
 
 }
 deletedProvide = [];

 deleteProvider1(index) {
 
 let i = this.tempKeysInsurannce.indexOf
 this.tempKeysInsurannce.splice(index,1);
 this.tempValues1.splice(index,1)
 this.insuranceProviders.splice(index,1);
 
 
 }


 newUserDetails = [];
 addButtonclicked(signInForm) {
 
 if (signInForm.valid) {
 const params = {
email: this.userInformation.email,
 pharmacyUserEmail: signInForm.value.signinEmail,
 firstName: signInForm.value.firstName,
 lastName: signInForm.value.lastName
 };
 
 this.newUserDetails.push(params.email + " " + params.firstName + " "+ params.lastName)
 this.auth.newUser(params).subscribe((res:any) => { console.log(res)
 if(res.statusCode == 200){
  this.addNewUser.push(params.firstName + " " + params.lastName);
 }else if(res.statusCode ==401) {
	this.msgs = [];
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

 
}

addProviders(){
 const header = {'authentication_token': localStorage.getItem ('authentication_token')};
 this.http.get(environment.host + 'insurance_providers/', { headers: header}).subscribe((data) =>
 {
 this.updateInsuranceProvider.push(data['object'])
 this.insuranceProviders.push(this.updateInsuranceProvider[0].map((e) => { return { 'label': e.providerName, 'value': {'name': e.providerName,'id': e.id }}
 }))
 this.insuranceProviders = this.insuranceProviders[0]

 
 
 })
}

cancelUserDetails(){
	 this.country=this.userInformation.zipcode
	this.accouEdit = false;
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
}
}
