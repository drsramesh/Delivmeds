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
import { LazyLoadEvent } from 'primeng/api';
import { PubnubService } from '../pubnub.service';
import { MessageService } from 'primeng/components/common/messageservice';


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

  Orders: any  = [];
 msgs = [];
  cols: any[];
  colors: string;
  listOfOrderTypes: any[];
  columns: any[];
  yearFilter: number;
  filterableOrders = [];
  yearTimeout: any;
  loading:boolean = false

  totalRecords: number;
  Order_two: any;
  constructor(  private http: HttpClient,
    private router: Router,
    private loader: PreloadService,
    private auth: DelivMedsAuthService,private pb: PubnubService,
  private pubnub:PubNubAngular,
  private messageService: MessageService) { }

  ngOnInit() {
  

    if (localStorage.getItem("authentication_token") !== null) {
      this.pb.init((message) => {
        // console.log("Home component")
        console.log(message);
        this.getOrderDetails(message['message']['map']['orderId']);
  
    //  console.log(message['message']['map']['orderId']);
     
        // console.log(message['message']['map']['orderId']);
        
        // this.msgs.push({severity: 'info', summary:message['message']['map']['orderId'], detail: message['message']['map']['message'],isRoute:true});
        
      });
    //  console.log("authentication Token");
      
      this.OrderList();

        this.listOfOrderTypes = [
            { name: 'All Orders', value: 'AllOrders' },
            { name: 'New Orders', value: 1 },
            { name: 'Active Orders', value: 2 },
            { name: 'Rejected Orders', value: 3 },
            { name: 'Completed Orders', value: 4 }
        ];

        this.cols = [
            { field: 'id', header: 'Order ID' },
            { field: 'prescriptionNo', header: 'Prescription ID' },
            { field: 'patientName', header: 'Patient Name' },
            { field: 'OrderDate', header: 'Order Date' },
            { field: 'status', header: 'Status' },
            {field: 'time', header: ''},
        ];
        
      
    }else {
      this.router.navigate(['/login'])
    }
  }

OrderList() {
  
  this.loader.open();
  this.http.get(environment.host + 'order/pharmacy').subscribe((res: any) => {
    if(res.statusCode === 401 && res.errors[0] ==="no orders found") {
      this.loader.close();
      console.log('No orders Found.');
      }
      else if( res.statusCode == 401 && res.errors[0] ==="Session Expired"){
          this.msgs = [];
           this.router.navigate(['/login']);
           this.loader.close();
           this.messageService.add({severity: 'error', summary: 'error', detail: 'Session got end, please Login.'});   
      } else {
           
         this.Orders = res['object']['orders'];
          // console.log(JSON.stringify(this.Orders));   
          // console.log(this.Orders)
         this.filterableOrders = res['object']['orders'];
         this.filterableOrders.forEach(function(order){
          if(order.customerResponse.hasOwnProperty("customerMembers")){
            order.patientName = order.customerResponse.customerMembers[0].firstName + " " + order.customerResponse.customerMembers[0].lastName
          } else{
            order.patientName = order.customerResponse.firstName + " " + order.customerResponse.lastName ;
          }
          
         }) 
       
         this.filterableOrders.forEach(function(order){
          //  console.log(order.customerResponse.phone);
           
          if(order.customerResponse.phone){
          order.Phone = order.customerResponse.phone;
          // console.log(order.Phone);
            switch(order.Phone.substring(0,2)) { 
              case "+9": { 
                 //statements; 
                //  console.log(order.Phone)
                 order.customerResponse.mobile_number = order.Phone.substring(3,order.Phone.length);
                //  console.log(order.customerResponse.mobile_number)
                 break; 
              } 
              case "+1": { 
                 //statements; 
                 order.customerResponse.mobile_number = order.Phone.substring(2,order.Phone.length);
                 break; 
              } 
              default: { 
                 //statements; 
                 order.customerResponse.mobile_number = order.Phone;
                 break; 
              } 
           } 
          
          }

         })
         
         this.loader.close();
         
        }
        this.loading = true;
  }, (err) => {
    this.loader.close();
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Server Error.'})
  }

);
  
}
display: boolean = false;
Order_one: any;
showDialog(Order){
 console.log(Order);
// this.Delivered(Order)
 this.display = true;
 this.Order_one = Order

 
}

 Delivered(Order){
  Order.loading = true;
  //  alert('hi')
   console.log(Order);
   
   let params = {

    orderId:Order.id,
     status: 7
   }
   console.log(params);
   
  // this.auth.statusOrder(params).subscribe((res:any) => {
  //   // console.log(params);
  //   console.log(res);
  //   Order.status = res.object.status;
  //   this.display = false
  //   //  this.OrderList();
  //   Order.loading = false;
  // });  
  this.auth.statusOrder(params).subscribe((res:any) => {
    if ( res.statusCode == 401 && res.errors[0] ==="Session Expired") {
      this.display = false
      Order.loading = false;
     this.msgs = [];
     this.router.navigate(['/login']);
     this.messageService.add({severity: 'error', summary: 'error', detail: 'Session got end, please Login.'});
   // console.log(params);
  
   }else if(res.code === 1) {
    
     console.log(res);
     Order.status = res.object.status;
     this.display = false
     //  this.OrderList();
     Order.loading = false;
     
   }
  }); 
  
 }

 display1: boolean = false;
 
 showDialog1(Order){

  // this.ReadyForPickup(Order);
  this.display1 = true;
  this.Order_two = Order
  console.log(this.Order_two);

  
 }

 ReadyForPickup(Order){
  
  Order.loading = true;


   let params = {
    orderId:Order.id,
     status: 6
   } 
  this.auth.statusOrder(params).subscribe((res:any) => {
  if ( res.statusCode == 401 && res.errors[0] ==="Session Expired") {
    this.display1 = false
    Order.loading = false;
   this.msgs = [];
   this.router.navigate(['/login']);
   this.messageService.add({severity: 'error', summary: 'error', detail: 'Session got end, please Login.'});
 // console.log(params);

 }else if(res.code === 1) {
  
   console.log(res);
   Order.status = res.object.status;
   this.display1 = false
   //  this.OrderList();
   Order.loading = false;
   
 }
}); 
 }



  visible: boolean = true;
sample(event) {
  this.filterableOrders = [];
  
 
  switch (event.value.value) {
    

    case "AllOrders":
     
      for(let i = 0;i < this.Orders.length;i++)
      
      {
      
        if ((this.Orders[i].status !=3)  && ((this.Orders[i].status !=4)))
        {
          this.filterableOrders.push(this.Orders[i]);
        }
      }

    break;

    case 1 :  
    for(let i = 0;i < this.Orders.length;i++)
    
      {
     
        if (this.Orders[i].status ==1)
        {
          this.filterableOrders.push(this.Orders[i]);
        }
  }
  break;

  case 2 :
    for(let i = 0;i < this.Orders.length;i++)
      {
        if ((this.Orders[i].status ==2 ||  this.Orders[i].status ==5 || this.Orders[i].status ==6) )
        {
          this.filterableOrders.push(this.Orders[i]);
          
          
        }
  }
  break;

  case 3 :
    for(let i = 0;i < this.Orders.length;i++)
      {
        if ((this.Orders[i].status ==3) || (this.Orders[i].status ==4) )
        {
          this.filterableOrders.push(this.Orders[i]);
        }
  }
  break;

  case 4 :
    for(let i = 0;i < this.Orders.length;i++)
      {
        if (this.Orders[i].status ==7){
        this.filterableOrders.push(this.Orders[i]);
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
  this.Orders.splice(index,1);
  this.filterableOrders.splice(index,1);
  
}

 onScroll() {
  console.log('scrolled!!');
}
onScrollUp() {
  console.log('scrolled up!!');
}


getOrderDetails(id){
  const header = {'authentication_token': localStorage.getItem('authentication_token')};

 this.http.get(environment.host + 'order/pharmacy/' + id, {headers: header}).subscribe((res: any) => {
  if(res.object.status ==1) {
   if(res['object'].customerResponse.hasOwnProperty('customerMembers')){
         res['object'].patientName = res['object'].customerResponse.customerMembers[0].firstName + " " +  res['object'].customerResponse.customerMembers[0].lastName
        }else  {
         res['object'].patientName = res['object'].customerResponse.firstName + " " + res['object'].customerResponse.lastName ;
      }
      this.Orders.unshift(res.object)
      // this.filterableOrders.unshift(res.object)
    }else {
      if( this.Orders.length>0)
      this.Orders[this.Orders.map(object=>object.id).indexOf(id)].status = res.object.status;
    }
 })
}
}