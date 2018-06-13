import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
 
  weekdays : any[];
  array = [];
    
  constructor() { }
  

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

  count(name: string){
    console.log(name);

  }

}
