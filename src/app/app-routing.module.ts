import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { OrderViewComponent } from './order-view/order-view.component';

const routes: Routes = [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      // {path:'**', component: LoginComponent},
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'orders', component: HomeComponent },
      {path: 'order-view', component: OrderViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
