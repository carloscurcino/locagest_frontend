import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar.component';
import { RentalManagementComponent } from './rental-management.component';
import { VehicleManagementComponent } from './components/vehicle-management/vehicle-management.component';
import { ClientManagementComponent } from './components/client-management/client-management.component';
import { StartRentalComponent } from './components/start-rental/start-rental.component';
import { EndRentalComponent } from './end-rental.component';
import { CommonModule } from "@angular/common";
import { LoginComponent } from './auth/login/login.component';

import { provideHttpClient, withFetch } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rentals', component: RentalManagementComponent },
  { path: 'vehicles', component: VehicleManagementComponent },
  { path: 'clients', component: ClientManagementComponent },
  { path: 'start', component: StartRentalComponent },
  { path: 'end', component: EndRentalComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EndRentalComponent
  ],
  imports: [
    BrowserModule,
    RentalManagementComponent,
    VehicleManagementComponent,
    ClientManagementComponent,
    SidebarComponent,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
