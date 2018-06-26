import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';
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
    private loader: PreloadService) { }

  ngOnInit() {
    // this.carService.getCarsMedium().then(cars => this.cars = cars);
this.OrderList();

        this.brands = [
            { name: 'All Orders', value: '1' },
            { name: 'New Orders', value: '0' },
            { name: 'Active Orders', value: '1' },
            { name: 'Rejected Orders', value: '0' },
            { name: 'Completed Orders', value: '0' }
        ];

        this.filterableCars = [].concat(this.cars);
        this.cols = [
            { field: 'id', header: 'Order ID' },
            { field: 'Prescription', header: 'Prescription ID' },
            { field: 'PatientName', header: 'Patient Name' },
            { field: 'OrderDate', header: 'Order Date' },
            { field: 'status', header: 'Status' },
            {field: 'time', header: ''},
        ];
        console.log(this.cols);
  }
  onYearChange(event, dt) {
    console.log(dt);
    if (this.yearTimeout) {
        clearTimeout(this.yearTimeout);
    }

    this.yearTimeout = setTimeout(() => {
        dt.filter(event.value, 'year', 'gt');
    }, 250);
}
pages :boolean
OrderList() {
  const header = {'authentication_token': localStorage.getItem('authentication_token')};
  console.log(header);
  console.log("auth" + localStorage.getItem ('authentication_token'));
  this.loader.open();
  this.http.get(environment.host + 'order/pharmacy').subscribe((res: any) => {
    console.log(res)
    if(res.statusCode === 401) {
      //alert('zipcode is not servicable')
      this.msgs.push({severity: 'error', summary: 'Error', detail: 'No Orders Found '});
      this.loader.close();
      console.log('No orders Found');
      } else {
            console.log(JSON.stringify(res));
         this.cars = res['object']['orders'];
         this.pages = true
         this.loader.close();
         
         
        // this.zipcodeService.push
          console.log(this.cars);
        //  this.editForm.patchValue({city: this.zipCodeServices.object.city ,state: this.zipCodeServices.object.state});
 
        }
  }, (err) => {
    this.loader.close();
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Server Error'});
    // this.toasts.error('Server Error', 'Oops!', { 'showCloseButton': true });
  }

);
  
}


 viewDetail(id){
     console.log("button clicked");
     console.log(id);
     const header = {'authentication_token': localStorage.getItem('authentication_token')};
     if (id != null || undefined)
     {
      localStorage.setItem('orderId', id) ;
      console.log(localStorage.getItem('orderId'));
      this.router.navigate(['/order-view']);
      
     }
 }


sample(event) {
  this.cars = [];

  switch (event.value.value) {
    case "1":
       console.log(this.filterableCars.length);
      for(let i = 0;i < this.filterableCars.length;i++)
      {
        console.log(this.filterableCars[i].status)
        if ((this.filterableCars[i].status !="0") && (this.filterableCars[i].status !="Delivered")  && ((this.filterableCars[i].status !="1")))
        {
          this.cars.push(this.filterableCars[i]);
        }
      }
      console.log(this.cars);
    break;

    case "0" :
   
    for(let i = 0;i < this.filterableCars.length;i++)
      {
        console.log(this.filterableCars[i].status)
        if ((this.filterableCars[i].status =="1") )
        {
          this.cars.push(this.filterableCars[i]);
        }
  }
  break;

  case "1" :
    for(let i = 0;i < this.filterableCars.length;i++)
      {
        console.log(this.filterableCars[i].status)
        if ((this.filterableCars[i].status =="0") )
        {
          this.cars.push(this.filterableCars[i]);
        }
  }
  break;

  case "0" :
    for(let i = 0;i < this.filterableCars.length;i++)
      {
        console.log(this.filterableCars[i].status)
        if ((this.filterableCars[i].status =="1") )
        {
          this.cars.push(this.filterableCars[i]);
        }
  }
  break;

  case "1" :
    for(let i = 0;i < this.filterableCars.length;i++)
      {
        this.cars.push(this.filterableCars[i]);
    }
    break;
  }

  console.log(event.value.value);
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