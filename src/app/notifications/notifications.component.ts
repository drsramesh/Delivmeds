import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AUTH_PROVIDERS } from 'angular2-jwt';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  brands: any[];
  notifications= [];
  trashNotifi: any[];
  filteredNotifications = [];
  constructor(private router:Router) { }

  ngOnInit() {
    this.brands = [
      { name: '--All--', value: 'AllOrders' },
      { name: 'Active Orders', value: 'Active' },
      { name: 'Rejected Orders', value: 'Rejected' },
      { name: 'Completed Orders', value: 'Delivered' }
  ];
  this.notifications = [
    {
      "label":'Waiting for Delevery',
      "id": 1
    },
    {
      "label":'Awating for payment confirmation',
      "id": 2
    },
    {
      "label":'Transit',
      "id": 3
    },
    {
      "label":'New',
      "id": 4
    },
    {
      "label":'Rejected',
      "id": 5
    },
    {
      "label":'Delivered',
      "id": 6
    }
  ];
  this.filteredNotifications = [].concat(this.notifications);
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
    else {
      this.trashNotifi.splice(i,1)
    }
  }

  delete(id){
    let i=this.trashNotifi.indexOf(id)
    this.trashNotifi.splice(i,1)
 console.log(this.notifications.splice(i,1))
  }

  sample(event) {
    this.notifications = [];
    switch(event.value.value) {
      case "Active":
      console.log(this.filteredNotifications.length);
     for(let i = 0;i < this.filteredNotifications.length;i++)
     {
       console.log(this.filteredNotifications[i].label)
       if ((this.filteredNotifications[i].label !="Rejected") && (this.filteredNotifications[i].label !="Delivered") )
       {
         this.notifications.push(this.filteredNotifications[i]);
       }
     }
     console.log(this.notifications);
   break;

   case "Rejected" :
  
   for(let i = 0;i < this.filteredNotifications.length;i++)
     {
       console.log(this.filteredNotifications[i].label)
       if ((this.filteredNotifications[i].label =="Rejected") )
       {
         this.notifications.push(this.filteredNotifications[i]);
       }
 }
 break;

 case "Delivered" :
   for(let i = 0;i < this.filteredNotifications.length;i++)
     {
       console.log(this.filteredNotifications[i].label)
       if ((this.filteredNotifications[i].label =="Delivered") )
       {
         this.notifications.push(this.filteredNotifications[i]);
       }
 }
 break;

 case "AllOrders" :
   for(let i = 0;i < this.filteredNotifications.length;i++)
     {
       this.notifications.push(this.filteredNotifications[i]);
   }
   break;
 }

 console.log(event.value.value);
    }

  }
