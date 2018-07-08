import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
// import { AuthService } from './auth.service';
 import { AngularFireAuth }     from 'angularfire2/auth';
// import * as firebase  from 'firebase/app';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'


@Injectable()
export class MessagingService {

  // messaging = firebase.messaging()

  //private messageSource = new Subject()
  //currentMessage = this.messageSource.asObservable() // message observable to show in Angular component
// currentMessage = new BehaviorSubject(null)
//   constructor(
//     private db: AngularFireDatabase, 
//     private afAuth: AngularFireAuth
//   ) {}

//   private updateToken(token) {
//      this.afAuth.authState.take(1).subscribe(user => {
//        if (!user) return;

//     const data = { [user.uid]: token }
//       this.db.object('fcmTokens/').update(data)
//      })
//   }

// // get permission to send messages
//  getPermission() {
//    this.messaging.requestPermission()
//   .then(() => {
//      console.log('Notification permission granted.');
//      return this.messaging.getToken()
//    })
//    .then(token => {
//      console.log(token)
//      this.updateToken(token)
//    })
//    .catch((err) => {
//      console.log('Unable to get permission to notify.', err);
//    });
//  }

//  receiveMessage() {
//   this.messaging.onMessage(payload => {
//   console.log('Message received. ', payload);
//    this.currentMessage.next(payload)  });

// }
}

// getPermission() {
//   this.messaging.requestPermission()
//   .then(() => {
//     console.log('Notification permission granted.');
//     return this.messaging.getToken()
//   })
//   .then(token => {
//     console.log(token)
//     this.updateToken(token)
//   })
//   .catch((err) => {
//     console.log('Unable to get permission to notify.', err);
//   });
// }
// receiveMessage() {
//   this.messaging.onMessage((payload) => {
//    console.log("Message received. ", payload);
//    this.currentMessage.next(payload)
//  });


//   // Listen for token refresh
// monitorRefresh(user) {
//   this.messaging.onTokenRefresh(() => {
//     this.messaging.getToken()
//     .then(refreshedToken => {
//       console.log('Token refreshed.');
//       this.saveToken(user, refreshedToken)
//     })
//     .catch( err => console.log(err, 'Unable to retrieve new token') )
//   });
// }

// // save the permission token in firestore
// private saveToken(user, token): void {
  
//   const currentTokens = user.fcmTokens || { }

//   // If token does not exist in firestore, update db
//   if (!currentTokens[token]) {
//     const userRef = this.afs.collection('users').doc(user.uid)
//     const tokens = { ...currentTokens, [token]: true }
//     userRef.update({ fcmTokens: tokens })
//   }
// }
// used to show message when app is open

