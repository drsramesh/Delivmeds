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
import { MessageService } from 'primeng/components/common/messageservice';




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
 loading = false;
deletedIndex:number;
 imageSrc = [];
 mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
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
private route: ActivatedRoute,
private messageService: MessageService) { 
 this.images = [];
  // this.images.push({source:'assets/images/default.png', thumbnail: 'assets/images/default.png', title: 'Prescription'});
 }


 ngOnInit() {
   if(localStorage.getItem("authentication_token") !== null){
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
   } else {
    this.router.navigate(['/login'])
   }

 }


 sample(event) {
 console.log('changed event');
 }
 initItemRows(orderItem) {
  //  console.log(orderItem);
   
 let formRows = [];
 return this._fb.group({
 medicalName: [orderItem.drug],
 quantity: [orderItem.quantity,Validators.required],
 cost: [orderItem.unitPrice || '',(orderItem.status==3? '': Validators.required)],
 id: [orderItem.id ],
 status:[orderItem.status],
 copay:[orderItem.copayPrice || '' ],
 comments:[orderItem.comments || null]
 });
 
}


orderRejectedCompletey: string = "";

addReason1() {
 if(this.reasonForm1.valid){
  let params = {
    orderId:this.orderDetails.id,
    comments:this.orderRejectedCompletey,
    status: 3
    }
   
    this.auth.statusOrder(params).subscribe((res:any) => {
    this.display1 = false; 
    this.router.navigate(['/orders']);
    });
 }else {
  this.msgs = [];
  this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter the reason.'});
 }
 

}


print(): void {
 let printContents, popupWin;
 printContents = document.getElementById('print-section').innerHTML;
 popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,margin: 0mm,width=auto');
 //popupWin = window.open('', '_blank', 'top=0,left=0,width=auto,height=100%,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,margin: 0mm;');
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

weekdata: string = "";
greyImage: boolean = false;
delitm;
showDialog(i, details) {


  this.reasonForm.setValue = null;
//  this.weekdata = "";
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


temp(i,details) {
  this.deletedIndex = i
  
  if(this.invoiceForm.controls.itemRows["controls"][i]["controls"]["status"].value  ==2){
     this.invoiceForm.controls.itemRows['controls'][i]['controls']['cost'].setValue(1);
     this.invoiceForm.controls.itemRows['controls'][i]['controls']['quantity'].setValue(0);
     this.invoiceForm.controls.itemRows["controls"].splice(i,1)
     this.invoiceForm.value.itemRows.splice(i,1);
    this.previewOfUpdateClicked();
    
  } else {
    this.showDialog(i, details)
  }
}

deleteRow() {
console.log(this.deletedIndex );

console.log(this.invoiceForm.controls.itemRows["controls"][this.deletedIndex ]["controls"]);
   this.invoiceForm.controls.itemRows["controls"][this.deletedIndex ]["controls"]["cost"].setValidators([])
   this.invoiceForm.controls.itemRows["controls"][this.deletedIndex ]["controls"]["quantity"].setValidators([])
   this.invoiceForm.controls.itemRows["controls"][this.deletedIndex ]["controls"]["cost"].updateValueAndValidity();
   this.invoiceForm.controls.itemRows["controls"][this.deletedIndex ]["controls"]["quantity"].updateValueAndValidity();
   console.log(this.reasonForm)
 if(this.reasonForm.valid) {
   let params = {
     orderId:this.orderDetails.id,
     orderItemId:this.delitm,
     comments:this.weekdata,
     status: 3
     }
     this.display == false;
    console.log(params);
      this.auth.statusOrder(params).subscribe((res:any) => { 
        console.log(res);
        // this.weekdata="";
        this.reasonForm.reset();
        });
        this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]['controls']['status'].setValue(3);
        // this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]['controls']['cost'].setValue(1);
        // this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]['controls']['quantity'].setValue(0);
        console.log( this.invoiceForm.controls.itemRows['controls'][this.deletedIndex]);
        
      //  this.previewOfUpdateClicked();
      this.updateDiscount();
       this.display = false;
  
   
    } else {
     this.msgs = [];
     this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter the reason.'});
    }
    
}


private specialKeys: Array<number> = [46,8, 9, 27, 13, 110, 190, 35, 36, 37, 39];

onlyValues(event) {
  let e = <any> event   
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

if (event.keyCode == 8|| event.keyCode == 37 || event.keyCode == 39 ) {
return true;
}
else if ( key < 48 || key > 57  ) {
return false;
}
else if(event.keyCode == 222){
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
 console.log(this.invoiceForm);
 
  let orders = [];
if(this.sum ==0 || this.sumAfterDiscount == 0){
    this.msgs = [];
   this.msgs.push({severity: 'error', summary: 'Error', detail: "Please enter Quantity and Cost values."});
  }
  else if(this.invoiceForm.invalid){
    console.log("123");
    console.log(this.invoiceForm.value);
    orders = this.invoiceForm.value.itemRows.map(e =>{
      return {
      quantity: e.quantity,
      unitPrice: e.cost,
      status: e.status
      }
    });
  
orders.forEach(e => {
  if((e.quantity == 0 && e.status ==2) || (e.quantity == 0 && e.status ==1) ){
    this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter Quantity value.'});
  } else if(((e.unitPrice == 0 || '') && e.status ==2) || ((e.unitPrice == 0 || '') && e.status ==1)  ) {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter  Cost value.'});
  }else if((e.unitPrice == "." && e.status ==2) || (e.unitPrice == '.' && e.status ==1)  ) {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter  Cost value.'});
  }else if((e.quantity == '.' && e.status ==2) || (e.quantity == '.' && e.status ==1) ){
    this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter Quantity value.'});
  }
  
  else if(((e.quantity =='' && e.status ==2) || (e.unitPrice == '' && e.status ==2))) {
    console.log((e.quantity =='' && e.status ==2));
    console.log((e.unitPrice == '' && e.status ==2));
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter Quantity and Cost values.'});
  }
})
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
 console.log(orders);
 let orderItems =[]
 orders.forEach(e=> {
 if((e.quantity === "." && e.status ==2) || (e.quantity === "." && e.status ==1) ){
    this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter the quantity value.'});
  } else if((e.unitPrice === "." && e.status ==2) || (e.unitPrice === "." && e.status ==1)  ) {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter the cost value.'});
  }else if(((e.quantity =='' && e.status ==2) || (e.unitPrice == '' && e.status ==2))) {
    console.log((e.quantity =='' && e.status ==2));
    console.log((e.unitPrice == '' && e.status ==2));
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter  Quantity and Cost value.'});
  }else if(((e.unitPrice == 0 || '') && e.status ==2) || ((e.unitPrice == 0 || '') && e.status ==1)  ) {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter  Cost value '});
  } else if((e.quantity == 0 && e.status ==2) || (e.quantity == 0 && e.status ==1) ){
    this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter Quantity value.'});
  }
  else{
  orderItems.push(e)
      //  console.log(params);
      // this.loader.open();
  }
 })

 if(orders.length == orderItems.length){
let params = {
  id:this.orderDetails.id, 
  priceTotal: this.sumAfterDiscount,
  status: 2 ,
  orderItems: orders
  
   }
   console.log(params);
  this.auth.totalOrderPrice(params).subscribe((res:any) => {
  this.loader.close();
this.router.navigate(['/orders']);
});

 }
  

 }
 
//  else { 
//     this.setFormTouched(this.invoiceForm);
//     this.msgs = [];
//   this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter Quantity and Cost Value'});
//  }
 
}

display2: boolean = false;
car_two: any;
showDialog2(){
 // this.ReadyForPickup(car);
 this.display2 = true;
//  this.car_two = car
}


// ReadyForPickup(){
//   let id = this.route.snapshot.paramMap.get('id');
//   console.log(id);
  
//   let params = { 
//    orderId:id,
//     status: 6
//   }
//   console.log(params);
  
//  this.auth.statusOrder(params).subscribe((res:any) => {
//    console.log(params);
//    console.log(res);
//    this.display2 = false;
//    this.router.navigate(['/orders']);
//  });
// }

ReadyForPickup(){
  let id = +this.route.snapshot.paramMap.get('id');
  console.log(id);
  let params = {

   orderId:id,
    status: 6
  }
  console.log(params);
    
  this.auth.statusOrder(params).subscribe((res:any) => {
    if ( res.statusCode == 401 && res.errors[0] ==="Session Expired") {
      this.display2 = false
     this.msgs = [];
     this.router.navigate(['/login']);
     this.messageService.add({severity: 'error', summary: 'error', detail: 'Session got end, please Login.'});
   // console.log(params);
  
   }else if(res.code === 1) {
    
    console.log(params);
    console.log(res);
    this.display2 = false;
    this.router.navigate(['/orders']);
     
   }
  }); 
  
 }



display3: boolean = false;
car_one: any;
showDialog3(){
 this.display3 = true;
}

// Delivered(){
//   let id = +this.route.snapshot.paramMap.get('id');
//   console.log(id);
//   let params = {

//    orderId:id,
//     status: 7
//   }
//   console.log(params);
  
//  this.auth.statusOrder(params).subscribe((res:any) => {
//    console.log(params);
//    console.log(res);
//    this.display3 = false;
//    this.router.navigate(['/orders']);
  
//  });  

 
// }

Delivered(){
  let id = +this.route.snapshot.paramMap.get('id');
  console.log(id);
  let params = {

   orderId:id,
    status: 7
  }
  console.log(params);
    
  this.auth.statusOrder(params).subscribe((res:any) => {
    if ( res.statusCode == 401 && res.errors[0] ==="Session Expired") {
      this.display3 = false
     this.msgs = [];
     this.router.navigate(['/login']);
     this.messageService.add({severity: 'error', summary: 'error', detail: 'Session got end, please Login.'});
   // console.log(params);
  
   }else if(res.code === 1) {
    
    console.log(params);
    console.log(res);
    this.display3 = false;
    this.router.navigate(['/orders']);
     
   }
  }); 
  
 }

 setFormTouched(form_obj: any) {
 Object.keys(form_obj.controls).forEach(field => {
 const control = form_obj.get(field);
 console.log(control);
 control.markAsTouched({ onlySelf: true });
 });
 }

 initializeimageSrc(url){
  this.imageSrc.push(url);
 }
 imageViewer(imageName){
  console.log("image");
   
  const AWS = require('aws-sdk')
  console.log(AWS);
  
  const spacesEndpoint = new AWS.Endpoint('s3.amazonaws.com');
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'AKIAJ5YDHYU5AVE45CQA',
    secretAccessKey: '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',
    signatureVersion: 'v4'
  });
  console.log(s3);
  
  var space = 'deliv-meds-encrypted-assets'
   var key = imageName;
  // var key = this.orderDetails.rxImage
  var expireSeconds = 60*60

  s3.getSignedUrl('getObject', {
    Bucket: space,
    Expires: expireSeconds,
    Key: key
  }, (err, url) => {
    
    this.initializeimageSrc(url);
  });
}


showcopay: Boolean = false

 OrderList() {
 const header = {'authentication_token': localStorage.getItem('authentication_token')};
 this.loading = true
 const id = this.route.snapshot.paramMap.get('id');
 this.loader.open();
 this.http.get(environment.host + 'order/pharmacy/' + id, {headers: header}).subscribe((res: any) => {
   

 if( res.statusCode == 401 && res.errors[0] ==="Session Expired") {
    this.msgs = [];
     this.router.navigate(['/login']);
     this.messageService.add({severity: 'error', summary: 'error', detail: 'Session got end, please Login.'});   
 //alert('zipcode is not servicable')
 this.msgs = [];
 this.msgs.push({severity: 'error', summary: 'Error', detail: 'No Orders Found '});
 this.loading = false;
 this.loader.close();

 } else {
 this.orderDetails = res.object;
   console.log(this.orderDetails);
  // console.log(this.orderDetails.customerResponse.phone);
   if(this.orderDetails.customerResponse.phone){  
    switch( this.orderDetails.customerResponse.phone.substring(0,2)) { 
      case "+9": { 
         //statements; 
        //  console.log(order.Phone)
        this.orderDetails.customerResponse.mobile_number =  this.orderDetails.customerResponse.phone.substring(3,this.orderDetails.customerResponse.phone.length);
        //  console.log(order.customerResponse.mobile_number)
         break; 
      } 
      case "+1": { 
         //statements; 
         this.orderDetails.customerResponse.mobile_number =  this.orderDetails.customerResponse.phone.substring(2,this.orderDetails.customerResponse.phone.length);
         break; 
      } 
      default: { 
         //statements; 
         this.orderDetails.customerResponse.mobile_number =  this.orderDetails.customerResponse.phone;
         break; 
      } 
   } 
  }


  // For decrypted Image For sandbox
  // if(this.orderDetails.rxImage){
  // this.imageViewer(this.orderDetails.rxImage);
  // }

 
// For sandbox
//  if(this.orderDetails.rxImage){
//   this.imageSrc.push( "https://s3.amazonaws.com/deliv-meds-assets/" + this.orderDetails.rxImage)  
//   }


// for QA
if(this.orderDetails.rxImage){
  this.imageSrc.push( "https://s3.amazonaws.com/deliv-meds-resources/" + this.orderDetails.rxImage)
}

 this.customerResponses= res.object.customerResponse;
 this.addRowWithValues(this.orderDetails.orderItems);
 this.loader.close();
 }
 })
 }

 updateDiscount(){
 this.sum = 0;
 this.sumAfterDiscount = 0;
 let userDiscount = this.invoiceForm.value.itemRows.filter((e)=>{
 if(e.cost !="" &&e.quantity!="")
  if(e.status ==3){
    e.quantity =0;
    e.cost =1;
  }
 return e;
})
 if(userDiscount.length>0){
 userDiscount.forEach(element => {
 this.sum = this.sum + element.cost * element.quantity;
 this.sumAfterDiscount = this.sumAfterDiscount + element.cost * element.quantity * (element.copay/100 || 1);
 });

 }
 
 
}
}