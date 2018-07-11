import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Routes, Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../environments/environment'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { PreloadService } from '../services/preload.service'
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { DISABLED } from '@angular/forms/src/model';
import { element } from 'protractor';


@Component({
 selector: 'app-order-view',
 templateUrl: './order-view.component.html',
 styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
 items: any[];
 msgs = [];
 display1: boolean = false;
 week:any;
 reason: any;
 cars: any = [];
 brands: any[];
 addedButton =[]
 prescriptions: any[];
 images: any[];
 display: boolean = false;
 invoiceForm: FormGroup;
 reasonForm: FormGroup;
 reasonForm1: FormGroup;
 orderDetails:any;
 customerResponses: any;
 itemRows;
deletedIndex:number;
 imageSrc = [];
 imageDefault = [
 'assets/images/default.png'
 ];


 imageIndexOne = 0;
 imageIndexTwo = 0;


 constructor(private _fb: FormBuilder,
 private http: HttpClient,
 private router: Router,
 private loader: PreloadService,
 private auth: DelivMedsAuthService) { 
 this.images = [];
 // this.images.push({source:'https://s3.amazonaws.com/deliv-meds-resources/{{orderDetails.rxImage}}', thumbnail: 'https://s3.amazonaws.com/deliv-meds-resources/{{orderDetails.rxImage}}', title: 'Prescription'});
 }


 ngOnInit() {
 this.OrderList();

 // if(this.orderDetails.status == 3) {
 // // this.update= DISABLED
 // }

 this.reasonForm = this._fb.group({
 reason1:new FormControl(null, Validators.required)
 });

 this.reasonForm1 = this._fb.group({
 reason2:new FormControl(null, Validators.required) 
 });
 
 this.items = [
 {label:'Order',
 routerLink: '/orders'
 },
 {label:'Order Details',
 routerLink: '/order-view'
 }
 ];
 this.brands = [
 { name: '---', value: 1.0 },
 { name: '10%', value: 0.1 },
 { name: '20%', value: 0.2 },
 { name: '30%', value: 0.3 },
 { name: '40%', value: 0.4 },
 { name: '50%', value: 0.5 },
 { name: '60%', value: 0.6 },
 { name: '70%', value: 0.7 },
 { name: '80%', value: 0.8 },
 { name: '90%', value: 0.9 },
 { name: '100%', value: 1.0 }
];
this.week = this.brands[0];
console.log(this.brands.filter(object=>{return object.value == "0.1"})[0]['name'])
 }


 sample(event) {
 console.log('changed event');
 }
 initItemRows(orderItem) {
 let formRows = [];
 // orderItems.forEach(element => {
 let temp: any = '';
 // });
 console.log(orderItem.status);
 console.log( orderItem.status ==3 );
 
 
 console.log(orderItem);
 this.brands.filter(object=>{
 console.log(object.value, orderItem.copayPrice);
 return object.value == (orderItem.copayPrice)
 })
 // console.log();
 return this._fb.group({
 medicalName: [orderItem.drug],
 quantity: [orderItem.quantity,Validators.required],
 cost: [orderItem.unitPrice || '',(orderItem.status==3 ? '': Validators.required)],
// cost: [],
 id: [orderItem.id ],
 status:[orderItem.status],
 copay:[{name: this.brands.filter(object=>{return orderItem.copayPrice == object.value || orderItem.copayPrice == null })[0]['name'], value:orderItem.copayPrice} ],
 // copay:[{name: this.brands.filter(object=>{return orderItem.copayPrice == object.value })[0]['name'] | '---', value:orderItem.copayPrice}],
 //copay: [{ name: this.brands.filter(object=>{return object.value == (orderItem.copayPrice | temp)})[0]['name'] , value: orderItem.copayPrice } ]
 });
 
}


orderRejectedCompletey: string = " ";

addReason1() {
 console.log("reason deleted")
 
 let params = {
 orderId:this.orderDetails.id,
 comments:this.orderRejectedCompletey,
 status: 3
 }
 console.log(params);
 this.auth.statusOrder(params).subscribe((res:any) => {
 console.log(params);
 console.log(res);
 });
 this.display1 = false; 
 this.router.navigate(['/orders']);
}


Rejected(){
 console.log("reason")
 
}


print(): void {
 let printContents, popupWin;
 printContents = document.getElementById('print-section').innerHTML;
 popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,margin: 0mm,width=auto');
 //popupWin = window.open('', '_blank', 'top=0,left=0,width=auto,height=100%,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,margin: 0mm;');
 popupWin.document.open();
 popupWin.document.write(`
 <html>
 <body onload="window.print();window.close()">${printContents}</body>
 </html>`
 );
 popupWin.document.close();
}

showDialog1(){
 this.display1 = true;
 console.log('reason');
 
}

weekdata: string = " ";
greyImage: boolean = false;
delitm;
showDialog(i, details) {
 this.weekdata = "";
 this.display = true;
 console.log(details.value);
 this.deletedIndex = i;
this.delitm=details.value.id || 0
console.log(this.delitm)
}

addNewRow(i) {
 console.log(i);
 
 let control = <FormArray>this.invoiceForm.controls['itemRows'];
 // control.push(this.initItemRows({drug:'',dosage:'',quantity:'', copay:''}));
 control.push(this.initItemRows({drug:'',quantity:'',cost:'', copay:''}));
}

addRowWithValues(orderItems) {

 let formgroups = [];
 orderItems.forEach(element => {
 // let control = <FormArray>this.invoiceForm.controls['itemRows'];
 formgroups.push(this.initItemRows(element)); 
 });
 this.invoiceForm = this._fb.group({
 itemRows: this._fb.array(formgroups)
 }); 
}




deleteRow(i) { 
console.log(i);
 let control = <FormArray>this.invoiceForm.controls['itemRows'];
 console.log(control)
 control['controls'].forEach(element => {
 if(element['controls']['cost']>0)
 delete element['controls']['cost']['errors']['required'] ||  control['controls'][this.deletedIndex]['controls']['cost'].setValidators([])
 control['controls'][this.deletedIndex]['controls']['cost'].updateValueAndValidity()
 if(element['controls']['qunatity']>0) 
 delete element['controls']['cost']['errors']['required'] || control['controls'][this.deletedIndex]['controls']['quantity'].setValidators([])
 control['controls'][this.deletedIndex]['controls']['quantity'].updateValueAndValidity();
 if(element['controls']['cost']=0)
 delete element['controls']['cost']['errors']['required'] ||  control['controls'][this.deletedIndex]['controls']['cost'].setValidators([])
//  control['controls'][this.deletedIndex]['controls']['cost'].updateValueAndValidity();
 if(element['controls']['qunatity']=0) 
 delete element['controls']['cost']['errors']['required'] || control['controls'][this.deletedIndex]['controls']['quantity'].setValidators([])
//  control['controls'][this.deletedIndex]['controls']['quantity'].updateValueAndValidity();
 
 console.log(element)
 });
 let params = {
 orderId:this.orderDetails.id,
 orderItemId:this.delitm,
 // orderItemStatus:2,
 comments:this.weekdata,
 status: 3
 }
 this.weekdata="";
 console.log(params);
 
// this.auth.statusOrder(params).subscribe((res:any) => {
// console.log(params);
// console.log(res);
// this.greyImage = true;
// });
 
 this.display = false;
 
 
}

 private newMethod() {
 console.log("123");
 }

onlyValues(event) {

 const pattern = /[0-9]/;
 let inputChar = String.fromCharCode(event.charCode);
 if (!pattern.test(inputChar)) {
 // invalid character, prevent input
 event.preventDefault();
 }
}

// deleteRow1(index: number) {
// console.log("abac");
 
// console.log( index);
 
// const control = <FormArray>this.invoiceForm.controls['itemRows'];
// // control.removeAt(index);
// const header = {'authentication_token': localStorage.getItem('authentication_token')};
// let params = {
// orderId:this.orderDetails.id,
// // orderItemStatus:2,
// status: 3
// }
// console.log(params);
 
// // this.auth.statusOrder(params).subscribe((res:any) => {
// // console.log(params);
// // console.log(res);
// // this.greyImage = true;
// // });
 
// this.display = false;
 
 
// }
total = [];
sumTotal = [];
sum = 0;
sum1 = 0
sumAfterDiscount = 0;
 previewOfUpdateClicked(value){
 this.sum = 0;
 this.sumAfterDiscount = 0;
 let Discount = this.invoiceForm.value.itemRows.filter((e)=>{
 if(e.cost !="" &&e.quantity!="")
 return [parseInt(e.quantity),parseInt(e.cost), e.copay.value]}
)

 if(Discount.length>0){
 Discount.forEach(element => {
 this.sum = this.sum + element.cost * element.quantity;
 this.sumAfterDiscount = this.sumAfterDiscount + element.cost * element.quantity * (element.copay.value || 1);
 });

 }
 
 
}

 updateButtonClicked(itemRows){ 
 // console.log(itemRows);
 console.log(this.invoiceForm);
 let orders = [];

 
 if(this.invoiceForm.valid) {
 console.log(this.sum1);
 orders = this.invoiceForm.value.itemRows.map(element =>{
 return {
 drug: element.medicalName,
 quantity: element.quantity,
 unitPrice: element.cost,
 copayPrice: element.copay.value,
 status: element.status || 2,
 id:element.id || 0
 }

 });
 
 console.log(orders)
 let params = {
 id:this.orderDetails.id, 
 priceTotal: this.sumAfterDiscount,
 status: 2 ,
 orderItems: orders
 
 }
 console.log(params);
 
// this.auth.totalOrderPrice(params).subscribe((res:any) => {

// console.log(params);
// console.log(res);
 
// this.router.navigate(['/orders']);
// });
 }

 
 else {
 // this.setFormTouched(this.invoiceForm);
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'please enter all fields'});
 }
 
}



 setFormTouched(form_obj: any) {
 Object.keys(form_obj.controls).forEach(field => {
 const control = form_obj.get(field);
 control.markAsTouched({ onlySelf: true });
 });
 }

 OrderList() {
 const header = {'authentication_token': localStorage.getItem('authentication_token')};
 var orderId = localStorage.getItem('orderId')
 console.log(header);
 console.log("auth" + localStorage.getItem ('authentication_token'));
 this.loader.open();
 this.http.get(environment.host + 'order/pharmacy/' + orderId, {headers: header}).subscribe((res: any) => {
 console.log('orderView =' + JSON.stringify(res));
 if(res.statusCode === 401) {
 //alert('zipcode is not servicable')
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'No Orders Found '});
 this.loader.close();
 console.log('No orders Found');
 } else {
 // console.clear();
 console.log(res);
 console.log(JSON.stringify(res));
 this.orderDetails = res.object;
 console.log(this.orderDetails);
 if(this.orderDetails.rxImage){
 console.log("image");
 
 this.imageSrc.push( "https://s3.amazonaws.com/deliv-meds-resources/" + this.orderDetails.rxImage)
 
 
 }
 console.log(this.imageSrc);
 console.log(this.orderDetails.rxImage);
 
 
 //this.cars = res.object;
 this.customerResponses= res.object.customerResponse;
 this.addRowWithValues(this.orderDetails.orderItems);

 this.orderDetails.orderItems.map((e => {
 // if(e.status == 3) {
 e.greyImage = true;
 // } else {
 // e.greyImage = false;
 // }
 }))
 console.log(this.orderDetails.orderItems);
 
 // this.zipcodeService.push
 //console.log(this.cars);
 console.log( 'orderID' + JSON.stringify(this.orderDetails));
 console.log( 'responses' + JSON.stringify(this.customerResponses));
 this.loader.close();
 // this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
 
 }
 })
 
 }


}