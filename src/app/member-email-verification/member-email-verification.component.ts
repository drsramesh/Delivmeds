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
  selector: 'app-member-email-verification',
  templateUrl: './member-email-verification.component.html',
  styleUrls: ['./member-email-verification.component.css']
})
export class MemberEmailVerificationComponent implements OnInit {
  confirmKey:any;
  msgs = [];
  showButton: any;
  constructor( private toastr:ToastsManager,
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
      // this.preLoader.open();
      this.activatedRoute.queryParams.subscribe(params => {
        this.confirmKey = params['key'];
        // alert(params['key'])
        console.log(this.confirmKey)
        if(this.confirmKey !== undefined){
          var confirmToken = {email_token:this.confirmKey};
          this.auth.memberEmail(confirmToken).subscribe(
            (res:any) =>{ console.log(res)
              // this.preLoader.close();
              if(res.code ==1){
                this.showButton = 1
                this.msgs = [];
                // alert("Email verified successfully")
                // this.router.navigate(['/login']);
                this.messageService.add({severity: 'success', summary: 'Success', detail: 'Your Account has been verified now.'});
              
              }else if(res.statusCode ==401) {
                this.msgs = [];
                this.showButton = 401;
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Account not verified.'});
                // this.router.navigate(['/login']);
               
               
              }
              else{
                this.msgs = [];
                this.showButton = 401;
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Account not verified.'});
                //  this.router.navigate(['/login']);
              }
            } ,
          
            (err) => {
              // this.preLoader.close();
             
            }
          )
        }
      
        else{
          // this.preLoader.close();
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
