import { Routes } from '@angular/router';
import { RentalManagementComponent } from './rental-management.component';
import { VehicleManagementComponent } from './components/vehicle-management/vehicle-management.component';
import { ClientManagementComponent } from './components/client-management/client-management.component';
import { StartRentalComponent } from './components/start-rental/start-rental.component';
import { EndRentalComponent } from './end-rental.component';

export const routes: Routes = [
  { path: '', redirectTo: 'rentals', pathMatch: 'full' },
  { path: 'rentals', component: RentalManagementComponent },
  { path: 'vehicles', component: VehicleManagementComponent },
  { path: 'clients', component: ClientManagementComponent },
  { path: 'start', component: StartRentalComponent },
  { path: 'end', component: EndRentalComponent },
];
