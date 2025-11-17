import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { Client, Vehicle, Rental } from './models';

@Component({
  selector: 'app-start-rental',
  template: `
    <div class="p-6 max-w-3xl">
      <h1 class="text-2xl font-bold mb-4">Iniciar Novo Aluguel</h1>

      <form (ngSubmit)="start()" #f="ngForm" class="space-y-4 bg-white p-4 rounded shadow">
        <!-- Dados do Cliente -->
        <div>
          <label class="block font-semibold mb-1">Cliente</label>
          <select name="cliente" required [(ngModel)]="clienteId" class="w-full border rounded p-2">
            <option value="" disabled>Selecione um cliente...</option>
            <option *ngFor="let c of clients" [value]="c.id">{{ c.nome }} — {{ c.cpf }}</option>
          </select>
          <div *ngIf="clienteId && selectedClient" class="text-sm text-gray-600 mt-1">
            CNH: {{ selectedClient.cnhNumero || '-' }} • Validade: {{ selectedClient.cnhValidade ? (selectedClient.cnhValidade | date:'short') : '-' }}
          </div>
        </div>

        <!-- Seleção de Veículo -->
        <div>
          <label class="block font-semibold mb-1">Veículo</label>
          <select name="veiculo" required [(ngModel)]="veiculoId" class="w-full border rounded p-2">
            <option value="" disabled>Selecione um veículo disponível...</option>
            <option *ngFor="let v of vehicles" [value]="v.id" [disabled]="v.status === 'locado'">
              {{ v.modelo }} — {{ v.placa }} <span *ngIf="v.status==='locado'"> (Locado)</span>
            </option>
          </select>
          <div *ngIf="selectedVehicle" class="text-sm text-gray-600 mt-1">
            KM atual: {{ selectedVehicle.kmAtual ?? '-' }} • Status: {{ selectedVehicle.status }}
          </div>
        </div>

        <!-- Datas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold mb-1">Data e hora inicial</label>
            <input name="dataInicio" required type="datetime-local" [(ngModel)]="dataInicio" class="w-full border rounded p-2" />
          </div>
          <div>
            <label class="block font-semibold mb-1">Data e hora prevista para devolução</label>
            <input name="dataPrevista" required type="datetime-local" [(ngModel)]="dataPrevista" class="w-full border rounded p-2" />
          </div>
        </div>

        <!-- KM entrega -->
        <div>
          <label class="block font-semibold mb-1">KM entrega</label>
          <input name="kmEntrega" type="number" min="0" [(ngModel)]="kmEntrega" class="w-full border rounded p-2" placeholder="Informe o km ao entregar o veículo" />
        </div>

        <!-- Erros -->
        <div *ngIf="errorMessage" class="text-red-600 font-medium">
          {{ errorMessage }}
        </div>

        <!-- Ações -->
        <div class="flex gap-2">
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Iniciar Locação</button>
          <button type="button" (click)="reset()" class="px-4 py-2 border rounded">Limpar</button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class StartRentalComponent {
  clients: Client[] = [];
  vehicles: Vehicle[] = [];

  clienteId = '';
  veiculoId = '';
  dataInicio = '';
  dataPrevista = '';
  kmEntrega?: number;

  errorMessage = '';

  constructor(private storage: StorageService) {
    this.clients = this.storage.getClients();
    this.vehicles = this.storage.getVehicles();
  }

  get selectedClient(): Client | undefined {
    return this.storage.getClientById(this.clienteId);
  }

  get selectedVehicle(): Vehicle | undefined {
    return this.storage.getVehicleById(this.veiculoId);
  }

  start() {
    this.errorMessage = '';

    // validações básicas
    if (!this.clienteId) { this.errorMessage = 'Selecione o cliente.'; return; }
    if (!this.veiculoId) { this.errorMessage = 'Selecione o veículo.'; return; }
    if (!this.dataInicio) { this.errorMessage = 'Informe a data e hora inicial.'; return; }
    if (!this.dataPrevista) { this.errorMessage = 'Informe a data e hora prevista para devolução.'; return; }

    // parse datas
    const inicio = new Date(this.dataInicio);
    const prevista = new Date(this.dataPrevista);
    if (isNaN(inicio.getTime()) || isNaN(prevista.getTime())) {
      this.errorMessage = 'Datas inválidas.';
      return;
    }
    if (inicio > prevista) {
      this.errorMessage = 'A data inicial não pode ser posterior à data prevista.';
      return;
    }

    const client = this.selectedClient;
    const vehicle = this.selectedVehicle;
    if (!client || !vehicle) {
      this.errorMessage = 'Cliente ou veículo não encontrado.';
      return;
    }

    // valida veículo já locado
    if (vehicle.status === 'locado') {
      this.errorMessage = 'Veículo já está locado.';
      return;
    }

    // valida CNH: se existir cnhValidade, checar validade >= dataInicio
    if (client.cnhValidade) {
      const cnhVal = new Date(client.cnhValidade);
      if (isNaN(cnhVal.getTime())) {
        // formato inválido; opcional: alertar
      } else {
        if (cnhVal < inicio) {
          this.errorMessage = 'CNH do cliente vencida antes da data de início. Não é possível locar.';
          return;
        }
      }
    } else {
      // sem CNH informada — política: impedir ou permitir? aqui impedimos
      this.errorMessage = 'Cliente não possui CNH cadastrada.';
      return;
    }

    // tudo ok: criar aluguel
    const rental: Rental = {
      id: 'R' + Date.now(),
      clienteId: client.id,
      veiculoId: vehicle.id,
      dataInicio: inicio.toISOString(),
      dataPrevista: prevista.toISOString(),
      kmEntrega: this.kmEntrega,
      status: 'ativo',
      criadoEm: new Date().toISOString()
    };

    // persistir aluguel
    this.storage.addRental(rental);

    // marcar veículo como locado
    const updatedVehicle: Vehicle = { ...vehicle, status: 'locado' };
    this.storage.updateVehicle(updatedVehicle);

    // feedback
    alert('Aluguel iniciado com sucesso.');
    this.reset();
    // recarrega listas locais
    this.clients = this.storage.getClients();
    this.vehicles = this.storage.getVehicles();
  }

  reset() {
    this.clienteId = '';
    this.veiculoId = '';
    this.dataInicio = '';
    this.dataPrevista = '';
    this.kmEntrega = undefined;
    this.errorMessage = '';
  }
}
