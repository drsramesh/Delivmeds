import { Component, OnInit } from '@angular/core';




@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css'],
})
export class OrderViewComponent implements OnInit {
  items: any[];
  brands: any[];
  prescriptions: any[];
  images: any[];

  imageSrc = [
    'assets/images/default.png',
    'assets/images/default1.png',
    'assets/images/default2.jpg',
    'assets/images/default4.png'
  ];

  imageIndexOne = 0;
  imageIndexTwo = 0;

  constructor() { 
    this.images = [];
        this.images.push({source:'assets/images/default.png', thumbnail: 'assets/images/default.png', title: 'Prescription'});
  }

  ngOnInit() {
    this.items = [
      {label:'Order',
      routerLink: '/orders'
    },
      {label:'Order Details',
      routerLink: '/order-view'
    }
  ];
  this.brands = [
    { name: 'All Orders', value: null },
    { name: 'Active Orders', value: 'Audi' },
    { name: 'Rejected Orders', value: 'BMW' },
    { name: 'Completed Orders', value: 'Fiat' }
];
this.prescriptions = [
  {},{}
]
  }

}
