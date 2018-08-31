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
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


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
import { APP_INITIALIZER } from '@angular/core';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {LightboxModule} from 'primeng/lightbox';
import { ToastModule } from 'ng2-toastr';
import Swal from 'sweetalert2'

// services
import { DelivMedsAuthService } from './services/deliv-meds-auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { RegisterService } from './services/register.service';
import { HomeService } from './services/home.service';
import { PreloadService } from './services/preload.service'
import { TokenInterceptor } from '././services/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthLoginGuardService } from './services/auth-login-guard.service';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import { PubNubAngular } from 'pubnub-angular2';
import { DelivMedsLoginGaurdService } from './services/auth-guard-service';
import {AppInitService } from './app-init.service'
import {RadioButtonModule} from 'primeng/radiobutton';

// import {AngularFireModule} from 'angularFire2';

import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { PubnubService } from './pubnub.service';
import { DirectiveDirective } from './directive.directive';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { SingleDotDirective } from './single-dot.directive';

//thirdParty
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';


import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FooterComponent } from './footer/footer.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { TimeDirective } from './time.directive';
export function init_app(appLoadService: AppInitService, pb: PubnubService) {

  return () => appLoadService.initializeApp();
}
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { CustomerEmailVerificationComponent } from './customer-email-verification/customer-email-verification.component';
import { MemberEmailVerificationComponent } from './member-email-verification/member-email-verification.component';
import { TraxdeEmailVerificationComponent } from './traxde-email-verification/traxde-email-verification.component';

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
    EmailverificationComponent,
    DirectiveDirective,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    SingleDotDirective,
    FooterComponent,
    TimeDirective,
    TermsConditionsComponent,
    CustomerEmailVerificationComponent,
    MemberEmailVerificationComponent,
    TraxdeEmailVerificationComponent
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
    RadioButtonModule,
    ImageViewerModule.forRoot(),
    InternationalPhoneNumberModule,
    InfiniteScrollModule,
    Ng2SearchPipeModule,
    ConfirmDialogModule,
    
  ],

  exports: [DirectiveDirective],
  providers: [ 
    DelivMedsAuthService,
    DelivMedsLoginGaurdService,
    AuthLoginGuardService,
    UserService,
    TokenService,
    RegisterService,
    TokenInterceptor,
    PreloadService,
    PubNubAngular,
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    PubnubService,
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppInitService],
      multi: true
    },
   
   ],
  bootstrap: [AppComponent]
  //  bootstrap: [TraxdeEmailVerificationComponent]
})
export class AppModule { }
