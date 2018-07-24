import { Injectable } from '@angular/core';
//pub nub
import { PubNubAngular } from 'pubnub-angular2';
import swal from 'sweetalert2';

@Injectable()
export class PubnubService {

  constructor(
    public pubnub: PubNubAngular
  ) { 
    pubnub.init({
      publishKey: 'pub-c-b62f7ab5-0dde-4000-a2c2-8a2df4d7d658',
      subscribeKey: 'sub-c-d7fdeca6-85c2-11e8-a7a7-6244ec17d0a3',
      ssl: false
    });
  }

  init(callback) {
   
    this.pubnub.addListener({
      status: function(st) {
          if (st.category === "PNConnectedCategory") {
            console.info('notifications connected')
          }
      },
      message: function(message) {
        callback(message);
        console.log(message['message']['map'])
        
       // swal(message['message']['map']['message'])
        // this.toasts.success("hi", "Oops!", { 'showCloseButton': true });
        // this.toastr.success('You are awesome!', 'Success!', {dismiss: 'controlled'})

          //  this.msgs = [];
          //  this.msgs.push({severity: 'success', summary: 'Success', detail: 'Notification Received.'});
         
      }
    });
  }
  subscribe(channel){
    console.log(channel);
    
    this.pubnub.subscribe({
              
        channels: [channel] ,        
        triggerEvents: true, withPresence: true, autoload: 100
    });

  }

  // history(channel, callback) {
  //   this.pubnub.history(
  //     {
  //         channel: channel,
  //         count: 100, // 100 is the default
  //         stringifiedTimeToken: true // false is the default
  //     },
  // function (status, response) 
  //     {
  //         console.log(status);
  //         // callback(response);
  //         // console.log(response);
  //     }
  // );
  
  // }

 

}
