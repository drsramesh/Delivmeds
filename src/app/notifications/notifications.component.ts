import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import { PubNubAngular } from 'pubnub-angular2';
import { PubnubService } from '../pubnub.service';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { Observable } from 'rxjs/Observable';
// import * as firebase from 'firebase/app';
// import { AngularFireObject, AngularFireList } from 'angularfire2/database';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  // user: Observable<firebase.User>;
  // items: AngularFireObject<any[]>;
  msgVal: string = '';
  message;
  brands: any[];
  notifications= [];
  trashNotifi: any[];
  filteredNotifications = [];
  pharmacyId: any
  constructor(private router:Router,
    private pb: PubnubService,
    public pubnub: PubNubAngular
    //public afAuth: AngularFireAuth, 
    // public af: AngularFireDatabase
  )
     {
      localStorage.getItem('pharmacyId')
     }

  ngOnInit() {
  //   console.log(this.pubnub);
    

  //  this.pubnub.publish({ channel: 'channel_1252', message: 'Hello!' }, (response) => {
  //     console.log(response);

  //     this.pubnub.history({ channel: 'channel_1252' }).then((response) => {
  //       console.log(response);
  //     });
  //   });

  // this.pubnub.subscribe({ channels: ['channel_1252']});
  // this.pb.history('channel_1252', (response) => {
  //   var a;
  //   // console.log(a);
    
  // }) ;
  
  //    this.pubnub.history(
  //      {
  //          channel :'channel_1252',
  //          reverse: true
  //         //  count : 9
  //      },
  //      function (status, response) {
  //          console.log(response);
  //      }
  //  );
  
  
    
    this.brands = [
      { name: '--All--', value: 'AllOrders' },
      { name: 'New Orders', value: 'New' },
      { name: 'Active Orders', value: 'Active' },
      { name: 'Rejected Orders', value: 'Rejected' },
      { name: 'Completed Orders', value: 'Delivered' }
  ];
  //this.msgService.getPermission()
  //this.msgService.receiveMessage()
 // this.message = this.msgService.currentMessage
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
       if ((this.filteredNotifications[i].label !="Rejected") && (this.filteredNotifications[i].label !="Delivered") && (this.filteredNotifications[i].label !="New") )
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

 case "New" :
   for(let i = 0;i < this.filteredNotifications.length;i++)
     {
       console.log(this.filteredNotifications[i].label)
       if ((this.filteredNotifications[i].label =="New") )
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
