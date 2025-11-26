import { StorageService } from './storage.service';
import { Rental } from "./models";
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StartRentalComponent } from './components/start-rental/start-rental.component';

@Component({
  selector: 'app-rental-management',
  standalone: true,
  imports: [CommonModule, StartRentalComponent],
  template: `
    <div class="page-container">

      <div class="page-header">
        <h1>Gerenciar Aluguéis</h1>
        <button class="btn-primary" (click)="abrirModal()">+ Novo Aluguel</button>
      </div>

      <div class="content-card">
        <div class="table-responsive">
          <table class="modern-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Início</th>
              <th>Prevista</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let r of rentals">
              <td>#{{r.id}}</td>

              <td class="font-medium">{{ r.cliente?.nome || 'Cliente #' + r.idCliente }}</td>
              <td>
                <span *ngIf="r.veiculo">
                    {{ r.veiculo.modelo }} - {{ r.veiculo.placa }}
                </span>
                <span *ngIf="!r.veiculo">Veículo #{{ r.idVeiculo }}</span>
              </td>

              <td>{{r.dataInicial | date:'dd/MM/yyyy HH:mm'}}</td>
              <td>{{r.dataDevolucao | date:'dd/MM/yyyy HH:mm'}}</td>
              <td>
                <span class="badge" [ngClass]="getBadgeClass(r.status)">{{r.status}}</span>
              </td>
              <td>
                <button *ngIf="r.status === 'PENDENTE'"
                        (click)="confirmarInicio(r.id)"
                        class="btn-sm btn-success">
                  Confirmar Saída
                </button>
                <span *ngIf="r.status !== 'PENDENTE'" class="text-muted">-</span>
              </td>
            </tr>

            <tr *ngIf="rentals.length === 0">
              <td colspan="7" class="empty-state">Nenhum aluguel registrado.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="isModalOpen" class="modal-overlay">
        <div class="modal-container">
          <app-start-rental
            (onSaved)="onLocacaoSalva()"
            (onCanceled)="fecharModal()">
          </app-start-rental>
        </div>
      </div>
    </div>
  `,
  styleUrl: './rental-management.component.css'
})
export class RentalManagementComponent implements OnInit {
  rentals: any[] = [];
  isModalOpen = false;
  private apiUrl = 'http://localhost:8080/api/locacoes';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarLocacoes();
  }

  abrirModal() { this.isModalOpen = true; }
  fecharModal() { this.isModalOpen = false; }

  onLocacaoSalva() {
    this.fecharModal();
    this.carregarLocacoes();
  }

  carregarLocacoes() {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.rentals = data;
        console.log('Dados recebidos:', data); // Útil para debug
      },
      error: (err) => console.error('Erro ao carregar:', err)
    });
  }

  confirmarInicio(id: number) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    this.http.put(`${this.apiUrl}/${id}/start`, {}, { headers }).subscribe({
      next: () => {
        this.carregarLocacoes();
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao confirmar início do aluguel.');
      }
    });
  }

  getBadgeClass(status: string) {
    switch (status) {
      case 'ATIVA': return 'badge-ativa';
      case 'PENDENTE': return 'badge-pendente';
      case 'FINALIZADA': return 'badge-finalizada';
      default: return 'badge-finalizada';
    }
  }
}
