import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  weekdays : any[];
  constructor() { }
  user: boolean = false;
  accouEdit:  boolean = false;
  
  ngOnInit() {
    this.weekdays= [
      {
        'name':'Daily',
      },
      {
        'name':'Weekdays only',
      },
      {
        'name':'Saturday',
      },
      {
        'name':'Sunday',
      }
    ]
  }
  addUser(){
    this.user= true
  }
  accountEdit(){
    this.accouEdit = true
  }
}
