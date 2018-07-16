import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { MyAccountComponent } from './my-account/my-account.component';


// Third party frameworks
import { TextMaskModule } from 'angular2-text-mask';
import { ImageViewerModule } from "ngx-image-viewer";



import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { GrowlModule } from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {TooltipModule} from 'primeng/tooltip';
import {MultiSelectModule} from 'primeng/multiselect';

import {BreadcrumbModule} from 'primeng/breadcrumb';
import {LightboxModule} from 'primeng/lightbox';

import { ToastModule } from 'ng2-toastr';

// services
import { StateService } from './services/state.service';
import { DelivMedsAuthService } from './services/deliv-meds-auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { RegisterService } from './services/register.service';
import { HomeService } from './services/home.service';
import { EmailRegistrationService } from './services/email-registration.service';
import { PreloadService } from './services/preload.service'
import { TokenInterceptor } from '././services/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthLoginGuardService } from './services/auth-login-guard.service';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import { PubNubAngular } from 'pubnub-angular2';
import { DelivMedsLoginGaurdService } from './services/auth-guard-service';

// import {AngularFireModule} from 'angularFire2';

import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { EmailverificationComponent } from './emailverification/emailverification.component';

// export const config = {
//   apiKey: "AIzaSyBPdrOSKvYG9KVXGO_sh42ojg-hfapvwPg",
//   authDomain: "delivmed-1528981249385.firebaseapp.com",
//   databaseURL: "https://delivmed-1528981249385.firebaseio.com",
//   projectId: "delivmed-1528981249385",
//   storageBucket: "",
//   messagingSenderId: "76947739447"
// };
// import {Ng4SpinnerModule} from 'ng4-spinner';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    OrderViewComponent,
    NotificationsComponent,
    NotificationDetailsComponent,
    MyAccountComponent,
    EmailverificationComponent
  ],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CalendarModule,
    InputTextareaModule,
    TabMenuModule,
    TextMaskModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    GrowlModule,
    HttpClientModule,
    MultiSelectModule,
    HttpModule ,
    HttpClientModule,
  // AngularFireAuthModule,
    ToastModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    BreadcrumbModule,
    LightboxModule,
        CheckboxModule,
    DialogModule,
  //  AngularFireAuthModule,
    TooltipModule,
    ProgressSpinnerModule,
    ImageViewerModule
 // AngularFireModule.initializeApp(config)
  
    // Ng4SpinnerModule// add it to the imports
    
  ],
  providers: [ 
    StateService,
    DelivMedsAuthService,
    DelivMedsLoginGaurdService,
    EmailRegistrationService,
    AuthLoginGuardService,
    UserService,
    TokenService,
    RegisterService,
    TokenInterceptor,
    PreloadService,
    PubNubAngular,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
