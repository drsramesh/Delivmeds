import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { DelivMedsLoginGaurdService } from './services/auth-guard-service'
const routes: Routes = [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      // {path:'**', component: LoginComponent},
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'orders', component: HomeComponent },
      {path: 'order-view', component: OrderViewComponent},
      {path: 'notifications', component: NotificationsComponent},
      {path:'notification-details', component: NotificationDetailsComponent},
      {path:'my-account', component: MyAccountComponent},
      {path:'confirm-mail', component: EmailverificationComponent},
      {path: '', redirectTo: 'auth', pathMatch: 'full'},
      // {
      //   path: 'sites',
      //   loadChildren: 'app/sites/sites.module#SitesModule',
      //   canActivate: [AuthGaurdService],
      // },
      // {
      //     path: 'auth',
      //     canActivate: [ AuthLoginGaurdService ],
      //     loadChildren: './auth/auth.module#AuthModule'
      // },
    
      // { path: '**', redirectTo: 'auth' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
