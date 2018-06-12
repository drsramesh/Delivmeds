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



// Third party frameworks
import { TextMaskModule } from 'angular2-text-mask';

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

import {BreadcrumbModule} from 'primeng/breadcrumb';
import {LightboxModule} from 'primeng/lightbox';

// services
import { StateService } from './services/state.service';
import { DelivMedsAuthService } from './services/deliv-meds-auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { RegisterService } from './services/register.service';
import { HomeService } from './services/home.service';
import { EmailRegistrationService } from './services/email-registration.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    OrderViewComponent
  ],
  imports: [
    BrowserModule,
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
    HttpModule ,
    Ng4LoadingSpinnerModule.forRoot(),
    BreadcrumbModule,
    LightboxModule,
    AutoCompleteModule,
    TooltipModule
  ],
  providers: [ StateService,
    DelivMedsAuthService,
    EmailRegistrationService,
    UserService,
    TokenService,DelivMedsAuthService,
    RegisterService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
