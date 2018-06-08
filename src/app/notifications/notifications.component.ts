import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  brands: any[];
  notifications: any[];
  trashNotifi: any[];
  constructor(private router:Router) { }

  ngOnInit() {
    this.brands = [
      { name: '--All--', value: null },
      { name: 'Active Orders', value: 'Audi' },
      { name: 'Rejected Orders', value: 'BMW' },
      { name: 'Completed Orders', value: 'Fiat' }
  ];
  this.notifications = [
    {
      "label":'Wating for Delevery',
      "id": 1
    },
    {
      "label":'Awating for payment confirmation',
      "id": 2
    },
    {
      "label":'Tansit',
      "id": 3
    },
    {
      "label":'Wating for Delevery',
      "id": 4
    }
  ];
  this.trashNotifi = [];
  }
  notification(){
    this.router.navigate(['/notification-details']);
  }
  enableTrash(id){
    let i=this.trashNotifi.indexOf(id)
    if(i==-1){
      this.trashNotifi.push(id)
    }
    else{
      this.trashNotifi.splice(i,1)
    }
  }
}
