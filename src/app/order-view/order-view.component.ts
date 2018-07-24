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
 private auth: DelivMedsAuthService,
private route: ActivatedRoute) { 
 this.images = [];
  // this.images.push({source:'assets/images/default.png', thumbnail: 'assets/images/default.png', title: 'Prescription'});
 }


 ngOnInit() {
  this.route.params.subscribe((params) => {
    // this.route.snapshot.paramMap.get('id');
    this.OrderList();
  });
//  this.OrderList();
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
 }


 sample(event) {
 console.log('changed event');
 }
 initItemRows(orderItem) {
 let formRows = [];
 return this._fb.group({
 medicalName: [orderItem.drug],
 quantity: [orderItem.quantity,Validators.required],
 cost: [orderItem.unitPrice || '',(orderItem.status==3 ? '': Validators.required)],
 id: [orderItem.id ],
 status:[orderItem.status],
 copay:[orderItem.copayPrice || '' ],
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

 this.auth.statusOrder(params).subscribe((res:any) => {
 this.display1 = false; 
 this.router.navigate(['/orders']);
 });

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
 
}

weekdata: string = " ";
greyImage: boolean = false;
delitm;
showDialog(i, details) {
  this.reasonForm.reset();
 this.weekdata = "";
 this.display = true;
 this.deletedIndex = i;
this.delitm=details.value.id || 0
}

addNewRow() {
 let control = <FormArray>this.invoiceForm.controls['itemRows'];
  control.push(this.initItemRows({drug:'',quantity:'',cost:'', copay:'' ,status:2}));
}

addRowWithValues(orderItems) {

 let formgroups = [];
 orderItems.forEach(element => {
 formgroups.push(this.initItemRows(element)); 
 });
 this.invoiceForm = this._fb.group({
 itemRows: this._fb.array(formgroups)
 }); 
}




deleteRow() {
  this.invoiceForm.controls.itemRows["controls"][this.deletedIndex]["controls"]["cost"].setValidators([])
  this.invoiceForm.controls.itemRows["controls"][this.deletedIndex]["controls"]["quantity"].setValidators([])
  this.invoiceForm.controls.itemRows["controls"][this.deletedIndex]["controls"]["cost"].updateValueAndValidity();
  this.invoiceForm.controls.itemRows["controls"][this.deletedIndex]["controls"]["quantity"].updateValueAndValidity();

 let params = {
 orderId:this.orderDetails.id,
 orderItemId:this.delitm,
 comments:this.weekdata,
 status: 3
 }
 this.weekdata="";
 this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]['controls']['status'].setValue(3);
  this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]['controls']['cost'].setValue(0);
  this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]['controls']['quantity'].setValue(1);
  this.previewOfUpdateClicked();
 this.display = false;
}

private specialKeys: Array<number> = [46, 8, 9, 27, 13, 110, 190, 35, 36, 37, 39];

onlyValues(event) {
  

  var key = window.event ? event.keyCode : event.which;

  if (this.specialKeys.indexOf(event.which) > -1) {
  return true;
  }
  else if ( key < 48 || key > 57 ) {
  return false;
  }
  else return true;
  };


  onlyValues1(event){
    var key = window.event ? event.keyCode : event.which;

if (event.keyCode == 8|| event.keyCode == 37 || event.keyCode == 39 || event.which == 65) {
return true;
}
else if ( key < 48 || key > 57 ) {
return false;
}
else return true;
};

total = [];
sumTotal = [];
sum = 0;
sum1 = 0
sumAfterDiscount = 0;
 previewOfUpdateClicked(){
 this.sum = 0;
 this.sumAfterDiscount = 0;
 let Discount = this.invoiceForm.value.itemRows.filter((e)=>{
 if(e.cost !="" &&e.quantity!="")
 return [parseInt(e.quantity),parseInt(e.cost), e.copay/100]}
)

 if(Discount.length>0){
 Discount.forEach(element => {
 this.sum = this.sum + element.cost * element.quantity;
 this.sumAfterDiscount = this.sumAfterDiscount + element.cost * element.quantity * (element.copay/100 || 1);
 });

 }
 
 
}



 updateButtonClicked(itemRows){ 
 // console.log(itemRows);
 
  let orders = [];
if(this.sum ==0 || this.sumAfterDiscount == 0){
    this.msgs = [];
   this.msgs.push({severity: 'error', summary: 'Error', detail: "Total value can't be zero"});
  }
 else if(this.invoiceForm.valid) {
 orders = this.invoiceForm.value.itemRows.map(element =>{
 return {
 drug: element.medicalName,
 quantity: element.quantity,
 unitPrice: element.cost,
 copayPrice: element.copay,
 status: element.status || 2 ,
 id:element.id || 0
 }

 });
 
 let params = {
 id:this.orderDetails.id, 
 priceTotal: this.sumAfterDiscount,
 status: 2 ,
 orderItems: orders
 
 }
 console.log(params);
 this.loader.open();
this.auth.totalOrderPrice(params).subscribe((res:any) => {
  this.loader.close();
this.router.navigate(['/orders']);
});
 }
 
 else {
   this.setFormTouched(this.invoiceForm);
   this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter Quantity and Cost fields'});
 }
 
}

ReadyForPickup(){
  let id = this.route.snapshot.paramMap.get('id');
  console.log(id);
  
  let params = { 
   orderId:id,
    status: 6
  }
  console.log(params);
  
 this.auth.statusOrder(params).subscribe((res:any) => {
   console.log(params);
   console.log(res);
   this.router.navigate(['/orders']);
 });
}

Delivered(){
  let id = +this.route.snapshot.paramMap.get('id');
  console.log(id);
  let params = {

   orderId:id,
    status: 7
  }
  console.log(params);
  
 this.auth.statusOrder(params).subscribe((res:any) => {
   console.log(params);
   console.log(res);
   this.router.navigate(['/orders']);
  
 });  

 
}



 setFormTouched(form_obj: any) {
 Object.keys(form_obj.controls).forEach(field => {
 const control = form_obj.get(field);
 control.markAsTouched({ onlySelf: true });
 });
 }

showcopay: Boolean = false

 OrderList() {
 const header = {'authentication_token': localStorage.getItem('authentication_token')};

 const id = this.route.snapshot.paramMap.get('id');
 this.loader.open();
 this.http.get(environment.host + 'order/pharmacy/' + id, {headers: header}).subscribe((res: any) => {

 if(res.statusCode === 401) {
 //alert('zipcode is not servicable')
 this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'No Orders Found '});
 this.loader.close();

 } else {
 this.orderDetails = res.object;
 if(this.orderDetails.rxImage){
 this.imageSrc.push( "https://s3.amazonaws.com/deliv-meds-resources/" + this.orderDetails.rxImage)
 }

 this.customerResponses= res.object.customerResponse;
 this.addRowWithValues(this.orderDetails.orderItems);
 this.loader.close();
 }
 })
 }
}