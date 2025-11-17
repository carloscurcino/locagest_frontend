import { Routes } from '@angular/router';
import { RentalManagementComponent } from './rental-management.component';
import { VehicleRegistrationComponent } from './vehicle-registration.component';
import { ClientRegistrationComponent } from './client-registration.component';
import { StartRentalComponent } from './start-rental.component';
import { EndRentalComponent } from './end-rental.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'rentals', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rentals', component: RentalManagementComponent, canActivate: [AuthGuard] },
  { path: 'vehicles', component: VehicleRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'start', component: StartRentalComponent, canActivate: [AuthGuard] },
  { path: 'end', component: EndRentalComponent, canActivate: [AuthGuard] },
];
