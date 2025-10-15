import { Routes } from '@angular/router';
import { RentalManagementComponent } from './rental-management.component';
import { VehicleRegistrationComponent } from './vehicle-registration.component';
import { ClientRegistrationComponent } from './client-registration.component';
import { StartRentalComponent } from './start-rental.component';
import { EndRentalComponent } from './end-rental.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'rentals', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rentals', component: RentalManagementComponent },
  { path: 'vehicles', component: VehicleRegistrationComponent },
  { path: 'clients', component: ClientRegistrationComponent },
  { path: 'start', component: StartRentalComponent },
  { path: 'end', component: EndRentalComponent },
];
