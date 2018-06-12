import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';
import { Http, Response } from '@angular/http';
import { Details } from '../Interface/details';

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

  cars: any[];

  cols: any[];
  colors: string;
  brands: any[];
  columns: any[];
  yearFilter: number;

  yearTimeout: any;

  constructor( ) { }

  ngOnInit() {
    // this.carService.getCarsMedium().then(cars => this.cars = cars);

        this.brands = [
            { name: 'All Orders', value: null },
            { name: 'Active Orders', value: 'Audi' },
            { name: 'Rejected Orders', value: 'BMW' },
            { name: 'Completed Orders', value: 'Fiat' }
        ];

        this.cars = [
          {
            'id': '12345678',
            'Prescription': '#xyz 123456',
            'PatientName': 1987,
            'OrderDate': '5/20/2018 11:43',
            'status': 'New',
            'time': '3:00pm to 8:00pm'
        },
        {
          'id': '12345678',
          'Prescription': '#xyz 123456',
          'PatientName': 1987,
          'OrderDate': '5/20/2018 11:43',
          'status': 'Rejected',
          'time': '3:00pm to 8:00pm'
      },
      {
        'id': '12345678',
        'Prescription': '#xyz 123456',
        'PatientName': 1987,
        'OrderDate': '5/20/2018 11:43',
        'status': 'Waiting For Delivery',
        'time': '3:00pm to 8:00pm'
    },
    {
      'id': '12345678',
      'Prescription': '#xyz 123456',
      'PatientName': 1987,
      'OrderDate': '5/20/2018 11:43',
      'status': 'Awaiting for payment confirmation',
      'time': '3:00pm to 8:00pm'
  },
  {
    'id': '12345678',
    'Prescription': '#xyz 123456',
    'PatientName': 1987,
    'OrderDate': '5/20/2018 11:43',
    'status': 'Waiting for cudtomer pickup',
    'time': '3:00pm to 8:00pm'
},
{
  'id': '12345678',
  'Prescription': '#xyz 123456',
  'PatientName': 1987,
  'OrderDate': '5/20/2018 11:43',
  'status': 'In Transit',
  'time': '3:00pm to 8:00pm'
},
{
  'id': '12345678',
  'Prescription': '#z 123456',
  'PatientName': 1987,
  'OrderDate': '5/20/2018 11:43',
  'status': 'Delivered',
  'time': '3:00pm to 8:00pm'
},
        ];

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


sample(event) {
  switch (event.name) {
    case 'Active Orders':
    // this.cols['status']
    console.log('All orders');
    break;
    case 2:
    console.log('case2');
    break;
  }
  console.log(event.value);
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

}
