//Importing Internal modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';

//Importing Third-party modules
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//Imporitng Application Modules

//Importing Application components

// Importing Application Services
import { UserService } from '../services/user.service';
import { DelivMedsAuthService } from '../services/deliv-meds-auth.service';
import { TokenService } from '../services/token.service';
import { PreloadService } from '../services/preload.service'

@Component({
  selector: 'app-customer-email-verification',
  templateUrl: './customer-email-verification.component.html',
  styleUrls: ['./customer-email-verification.component.css']
})
export class CustomerEmailVerificationComponent implements OnInit {
  confirmKey:any;
  msgs = [];
  showButton: any;
  constructor(
    private toastr:ToastsManager,
    private auth:DelivMedsAuthService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private tokenService:TokenService,
    private userService:UserService,
    private messageService: MessageService,
  private preLoader: PreloadService) { }

  ngOnInit() {
    console.log("123");
    
    // if(this.tokenService.getAuthenticationToken() === null || (this.tokenService.getAuthenticationToken() !== null))
    // console.log(this.tokenService.getAuthenticationToken() === null);
    // {
       this.preLoader.open();
      this.activatedRoute.queryParams.subscribe(params => {
        this.confirmKey = params['key'];
        // alert(params['key'])
        console.log(this.confirmKey)
        if(this.confirmKey !== undefined){
          var confirmToken = {email_token:this.confirmKey};
          this.auth.customerEmail(confirmToken).subscribe(
            (res:any) =>{ console.log(res)
               this.preLoader.close();
              if(res.code ==1){
                this.showButton = 1
                this.msgs = [];
                //  alert("Email verified successfully")
                // this.router.navigate(['/login']);
                this.messageService.add({severity: 'success', summary: 'Success', detail: 'Your Email id has been verified now. Please login now with your registered email.'});
              
              }else if(res.statusCode ==401) {
                this.showButton = 401;
                this.msgs = [];
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email not verified.'});
                // this.router.navigate(['/login']);
               
               
              }
              else{
                this.msgs = [];
                this.showButton = 401;
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email not verified.'});
                //  this.router.navigate(['/login']);
              }
            } ,
          
            (err) => {
               this.preLoader.close();
             
            }
          )
        }
      
        else{
           this.preLoader.close();
          this.msgs = [];
          this.showButton = 401;
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server error.'});
          this.router.navigate(['/login']);
        }
      })
    // }
    // }
    // else{
    //   this.router.navigate(['/login']);
    // }
  }

}
