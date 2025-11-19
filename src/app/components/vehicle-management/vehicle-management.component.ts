import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VehicleRegistrationComponent } from '../vehicle-registration/vehicle-registration.component';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, VehicleRegistrationComponent],
  template: `
    <div class="page-container">

      <div class="page-header">
        <h1>Gerenciar Veículos</h1>
        <button class="btn-primary" (click)="abrirModal()">+ Novo Veículo</button>
      </div>

      <div class="content-card">
        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>ID</th><th>Modelo</th><th>Placa</th><th>Ano</th><th>Cor</th><th>Categoria</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of vehicles">
                <td>#{{v.id}}</td>
                <td class="font-medium">{{v.modelo}}</td>
                <td>{{v.placa}}</td>
                <td>{{v.ano}}</td>
                <td>{{v.cor}}</td>
                <td>{{v.categoria}}</td>
                <td><span class="badge" [ngClass]="getBadgeClass(v.status)">{{v.status}}</span></td>
              </tr>
              <tr *ngIf="vehicles.length === 0">
                <td colspan="7" class="empty-state">Nenhum veículo cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="isModalOpen" class="modal-overlay">
        <div class="modal-container">
          <app-vehicle-registration (onSaved)="onSaved()" (onCanceled)="fecharModal()"></app-vehicle-registration>
        </div>
      </div>

    </div>
  `,
  styleUrl: './vehicle-management.component.css'
})
export class VehicleManagementComponent implements OnInit {
  vehicles: any[] = [];
  isModalOpen = false;
  private apiUrl = 'http://localhost:8080/api/veiculos';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.carregarVeiculos(); }

  abrirModal() { this.isModalOpen = true; }
  fecharModal() { this.isModalOpen = false; }

  onSaved() {
    this.fecharModal();
    this.carregarVeiculos();
  }

  carregarVeiculos() {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error(err)
    });
  }

  getBadgeClass(status: string) {
    switch (status) {
      case 'DISPONIVEL': return 'badge-ativa'; // Verde
      case 'LOCADO': return 'badge-pendente';  // Amarelo
      case 'MANUTENCAO': return 'badge-finalizada'; // Cinza
      default: return 'badge-finalizada';
    }
  }
}
