import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ClientRegistrationComponent } from '../client-registration/client-registration.component';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, ClientRegistrationComponent],
  template: `
    <div class="page-container">

      <div class="page-header">
        <h1>Gerenciar Clientes</h1>
        <button class="btn-primary" (click)="abrirModal()">+ Novo Cliente</button>
      </div>

      <div class="content-card">
        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of clients">
                <td>#{{c.id}}</td>
                <td class="font-medium">{{c.nome}}</td>
                <td>{{c.cpf}}</td>
                <td>{{c.email}}</td>
                <td>{{c.telefone}}</td>
              </tr>
              <tr *ngIf="clients.length === 0">
                <td colspan="5" class="empty-state">Nenhum cliente cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL -->
      <div *ngIf="isModalOpen" class="modal-overlay">
        <div class="modal-container">
          <app-client-registration
              (onSaved)="onSaved()"
              (onCanceled)="fecharModal()">
          </app-client-registration>
        </div>
      </div>

    </div>
  `,
  styleUrl: './client-management.component.css'
})
export class ClientManagementComponent implements OnInit {
  clients: any[] = [];
  isModalOpen = false;
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.carregarClientes(); }

  abrirModal() { this.isModalOpen = true; }
  fecharModal() { this.isModalOpen = false; }

  onSaved() {
    this.fecharModal();
    this.carregarClientes();
  }

  carregarClientes() {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error(err)
    });
  }
}
