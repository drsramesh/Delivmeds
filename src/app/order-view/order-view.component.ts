import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from  '../../environments/environment'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { PreloadService } from '../services/preload.service'


@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  items: any[];
  msgs = [];
  week:any;
  reason: any;
  cars: any  = [];
  brands: any[];
  addedButton =[]
  prescriptions: any[];
  images: any[];
  display: boolean = false;
  invoiceForm: FormGroup;
   orderDetails:any;
   customerResponses: any;
  itemRows;
  constructor(private _fb: FormBuilder,
    private http: HttpClient,
    private loader: PreloadService) { 
    this.images = [];
        this.images.push({source:'assets/images/default.png', thumbnail: 'assets/images/default.png', title: 'Prescription'});
  }

  ngOnInit() {
    this.OrderList();
    
    this.items = [
      {label:'Order',
      routerLink: '/orders'
    },
      {label:'Order Details',
      routerLink: '/order-view'
    }
  ];
  this.brands = [
    { name: 'Copay', value: 1.0 },
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
  }


  sample(event) {
    console.log('changed event');
  }
  initItemRows(orderItem) {
    let formRows = [];
    // orderItems.forEach(element => {
      
    // });
    return this._fb.group({
        medicalName: [orderItem.drug,Validators.required],
        dosage: [orderItem.dosage,Validators.required],
        quantity: [orderItem.quantity,Validators.required],
        cost: ['',Validators.required]
    });
}

addReason() {
  console.log("reason")
  this.display = false;

}

print(){
  console.log('print delivery address');
  window.print();
 // var mywindow = window.open('', 'PRINT', 'height=400,width=600');
  
}

showDialog() {
  this.display = true;
}

addNewRow() {
  let control = <FormArray>this.invoiceForm.controls['itemRows'];
  control.push(this.initItemRows({drug:'',dosage:'',quantity:''}));
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

deleteRow(index: number) {
  const control = <FormArray>this.invoiceForm.controls['itemRows'];
  control.removeAt(index);
  this.total.splice(index,1)
  this.display = false;
  console.log(this.total);
  console.log(this.total.splice(index,1));
  
  
}
total = [];
sumTotal = [];
sum = 0;
  updateButtonClicked(){    
    console.log(this.invoiceForm.valid);
    if(this.invoiceForm.valid) {
    this.sum = this.invoiceForm.value.itemRows.map((e)=>{return parseInt(e.cost)}).reduce(function(total,sum){
      return total+sum;
    })
  } else {
    
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'please enter all fields'});
  }
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
          console.clear();
          console.log(res);
          console.log(JSON.stringify(res));
          this.orderDetails = res.object;
           //this.cars = res.object;
          this.customerResponses= res.object.customerResponse;
          this.addRowWithValues(this.orderDetails.orderItems);
          // this.zipcodeService.push
            //console.log(this.cars);
            console.log( 'orderID' + JSON.stringify(this.orderDetails));
            console.log( 'responses' + JSON.stringify(this.customerResponses));
            this.loader.close();
          //  this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
   
          }
    })
    
  }


}