import { Component, OnInit } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { Details } from '../Interface/details';
import {HttpClientModule} from '@angular/common/http';
import { Routes, Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from  '../../environments/environment';
import { PreloadService } from '../services/preload.service';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { Logs } from 'selenium-webdriver';
//pub nub
import { PubNubAngular } from 'pubnub-angular2';


interface SortEvent {
  data?: any[];
  mode?: string;
  field?: string;
  order?: number;
  // multiSortMeta?: SortMeta[];
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cars: any  = [];
 msgs = [];
  cols: any[];
  colors: string;
  brands: any[];
  columns: any[];
  yearFilter: number;
  filterableCars = [];
  yearTimeout: any;

  constructor(  private http: HttpClient,
    private router: Router,
    private loader: PreloadService,
    private auth: DelivMedsAuthService,
  private pubnub:PubNubAngular ) { }

  ngOnInit() {
    if (localStorage.getItem("authentication_token") !== null) {
    //  console.log("authentication Token");
      
      this.OrderList();

        this.brands = [
            { name: 'All Orders', value: 'AllOrders' },
            { name: 'New Orders', value: 1 },
            { name: 'Active Orders', value: 2 },
            { name: 'Rejected Orders', value: 3 },
            { name: 'Completed Orders', value: 4 }
        ];

        this.cols = [
            { field: 'id', header: 'Order ID' },
            { field: 'Prescription', header: 'Prescription ID' },
            { field: 'PatientName', header: 'Patient Name' },
            { field: 'OrderDate', header: 'Order Date' },
            { field: 'status', header: 'Status' },
            {field: 'time', header: ''},
        ];
      
    }else {
      this.router.navigate(['/login'])
    }


        // console.log(this.cols);
  }
// pages :boolean
OrderList() {
  this.loader.open();
  this.http.get(environment.host + 'order/pharmacy').subscribe((res: any) => {
    if(res.statusCode === 401) {
      this.loader.close();
      console.log('No orders Found');
      } else {
            // console.log(JSON.stringify(res));
           

            
         this.cars = res['object']['orders'];
         this.filterableCars = res['object']['orders'];
         this.loader.close();
         
        }
  }, (err) => {
    this.loader.close();
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Server Error'})
  }

);
  
}
display: boolean = false;
car_one: any;
showDialog(car){
 console.log(car);
// this.Delivered(car)
 this.display = true;
 this.car_one = car
}

 Delivered(car){
  //  alert('hi')
   console.log(car);
   
   let params = {

    orderId:car.id,
     status: 7
   }
   console.log(params);
   
  this.auth.statusOrder(params).subscribe((res:any) => {
    console.log(params);
    console.log(res);
    this.display = false
    this.OrderList();
  });  
  
 }

 display1: boolean = false;
 car_two: any;
 showDialog1(car){
  console.log(car);
  // this.ReadyForPickup(car);
  this.display1 = true;
  this.car_two = car
 }

 ReadyForPickup(car){

   let params = {
    orderId:car.id,
     status: 6
   }
   console.log(params);
   
  this.auth.statusOrder(params).subscribe((res:any) => {
    // console.log(params);
    console.log(res);
    this.display1 = false
    this.OrderList();
   
  });
 }
 Refresh(){
  this.display1 = false
  this.OrderList();

 }

  visible: boolean = true;
//  updateVisibility(): void {
//    this.visible = false;
//    setTimeout(() => this.visible = true, 0);
//  }
sample(event) {


  this.filterableCars = [];
  // console.log(event.value.value);
  
 
  switch (event.value.value) {
    

    case "AllOrders":
     
      for(let i = 0;i < this.cars.length;i++)
      
      {
      
        if ((this.cars[i].status !=3)  && ((this.cars[i].status !=4)))
        {
          this.filterableCars.push(this.cars[i]);
        }
      }
      console.log(this.cars);
    break;

    case 1 :
  //  console.log(this.filterableCars.length);
   
    for(let i = 0;i < this.cars.length;i++)
      {
     
        if (this.cars[i].status ==1)
        {
          this.filterableCars.push(this.cars[i]);
        }
  }
  break;

  case 2 :
    for(let i = 0;i < this.cars.length;i++)
      {
        if ((this.cars[i].status ==2 ||  this.cars[i].status ==5 || this.cars[i].status ==6) )
        {
          this.filterableCars.push(this.cars[i]);
          
          
        }
  }
  break;

  case 3 :
    for(let i = 0;i < this.cars.length;i++)
      {
        if ((this.cars[i].status ==3) || (this.cars[i].status ==4) )
        {
          this.filterableCars.push(this.cars[i]);
        }
  }
  break;

  case 4 :
    for(let i = 0;i < this.cars.length;i++)
      {
        if (this.cars[i].status ==7){
        this.filterableCars.push(this.cars[i]);
        }
    }
    break;
  }

}
customSort(event: SortEvent) {
  event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 === null && value2 != null) {
          result = -1;
      } else if (value1 != null && value2 == null) {
          result = 1;
           } else if (value1 == null && value2 == null) {
          result = 0;
                  } else if (typeof value1 === 'string' && typeof value2 === 'string') {
          result = value1.localeCompare(value2);
                         } else {
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                         }

      return (event.order * result);
  });
}

deleteOrder() {
  console.log('button clicked');
}

count2(index){
  console.log("button0");
  this.cars.splice(index,1);
  this.filterableCars.splice(index,1);
  
}

}