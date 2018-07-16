//Importing Internal modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

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
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.css']
})
export class EmailverificationComponent implements OnInit {

  confirmKey:any;

  constructor(
    private toastr:ToastsManager,
    private auth:DelivMedsAuthService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private tokenService:TokenService,
    private userService:UserService,
  private preLoader: PreloadService) { }
  //&& this.tokenService.getRefreshToken() === null
  //Checking if any logged in user if not we will validate token and redirect to login page
  ngOnInit() {
    if(this.tokenService.getAuthenticationToken() === null ){
      this.preLoader.open();
      this.activatedRoute.queryParams
      .subscribe(params => {
        this.confirmKey = params['key'];
        console.log
        if(this.confirmKey !== undefined){
          var confirmToken = {confirmation_token:this.confirmKey};
          this.auth.confirmEmail(confirmToken).subscribe(
            (res:any) =>{
              this.preLoader.close();
              if(res.statuscode ===200){
               
                this.router.navigate(['/login']);
              }else{
                this.router.navigate(['/login']);
              }
            } ,
            (err) => {
              this.preLoader.close();
             
            }
          )
        }
        else{
          this.preLoader.close();
          
          this.router.navigate(['/login']);
        }
      })
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  
  }
  