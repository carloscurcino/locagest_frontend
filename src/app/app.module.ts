import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar.component';
import { RentalManagementComponent } from './rental-management.component';
import { VehicleRegistrationComponent } from './vehicle-registration.component';
import { ClientRegistrationComponent } from './client-registration.component';
import { StartRentalComponent } from './start-rental.component';
import { EndRentalComponent } from './end-rental.component';
import { CommonModule } from "@angular/common";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiBaseUrlInterceptor } from './auth/api-base-url.interceptor';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rentals', component: RentalManagementComponent },
  { path: 'vehicles', component: VehicleRegistrationComponent },
  { path: 'clients', component: ClientRegistrationComponent },
  { path: 'start', component: StartRentalComponent },
  { path: 'end', component: EndRentalComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    RentalManagementComponent,
    VehicleRegistrationComponent,
    ClientRegistrationComponent,
    StartRentalComponent,
    EndRentalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatIconModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiBaseUrlInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
