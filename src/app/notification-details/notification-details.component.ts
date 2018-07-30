import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.css']
})
export class NotificationDetailsComponent implements OnInit {

  constructor(private router:Router) { }
imageDefault = [];
 
  ngOnInit() {
    if (localStorage.getItem("authentication_token") !== null) {
      console.log('Not Null');
      
    }
    else{
      this.router.navigate(['\login'])
    }
  }

}
