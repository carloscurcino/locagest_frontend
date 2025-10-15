import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { Rental } from "./models";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-rental-management',
  template: `
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Gerenciar Aluguéis</h1>
    <table class="min-w-full bg-white">
      <thead><tr><th class="p-2">ID</th><th>Cliente</th><th>Veículo</th><th>Início</th><th>Prevista</th><th>Status</th></tr></thead>
      <tbody>
        <tr *ngFor="let r of rentals" class="border-t">
          <td class="p-2">{{r.id}}</td>
          <td class="p-2">{{getClientName(r.clienteId)}}</td>
          <td class="p-2">{{getVehicleModel(r.veiculoId)}}</td>
          <td class="p-2">{{r.dataInicio | date:'short'}}</td>
          <td class="p-2">{{r.dataPrevista | date:'short'}}</td>
          <td class="p-2">{{r.status}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class RentalManagementComponent {
  rentals: Rental[] = [];
  constructor(private storage: StorageService, private http: HttpClient) {
    this.rentals = storage.getRentals();
    // Teste GET com token
    this.http.get('/locacoes').subscribe({
      next: (res) => console.log('Resposta /locacoes:', res),
      error: (err) => console.error('Erro ao buscar /locacoes:', err)
    });
  }
  getClientName(id: string){ const c = this.storage.getClients().find(x=>x.id===id); return c?c.nome:'-'; }
  getVehicleModel(id: string){ const v = this.storage.getVehicles().find(x=>x.id===id); return v?v.modelo+' - '+v.placa:'-'; }
}
