import { NgModule } from '@angular/core';
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
import {CommonModule} from "@angular/common";

const routes: Routes = [
  // { path: '', component: LoginComponent } por exemplo
];

@NgModule({
  declarations: [
    AppComponent,
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
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
