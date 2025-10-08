import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import {Client, Vehicle} from "./models";
@Component({
  selector: 'app-start-rental',
  template: `
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Iniciar Aluguel</h1>
    <form (ngSubmit)="start()" #f="ngForm" class="space-y-4 max-w-xl">
      <div>
        <label>Cliente</label>
        <select name="cliente" [(ngModel)]="clienteId" class="block w-full border rounded p-2">
          <option *ngFor="let c of clients" [value]="c.id">{{c.nome}}</option>
        </select>
      </div>
      <div>
        <label>Veículo</label>
        <select name="veiculo" [(ngModel)]="veiculoId" class="block w-full border rounded p-2">
          <option *ngFor="let v of vehicles" [value]="v.id">{{v.modelo}} — {{v.placa}}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input name="dataInicio" type="datetime-local" [(ngModel)]="dataInicio" class="block border rounded p-2" />
        <input name="dataPrevista" type="datetime-local" [(ngModel)]="dataPrevista" class="block border rounded p-2" />
      </div>
      <button class="px-4 py-2 bg-green-600 text-white rounded">Iniciar</button>
    </form>
  </div>
  `
})
export class StartRentalComponent {
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  clienteId = '';
  veiculoId = '';
  dataInicio = '';
  dataPrevista = '';
  constructor(private storage: StorageService){
    this.clients = storage.getClients();
    this.vehicles = storage.getVehicles();
  }
  start(){
    const r = {
      id: 'R'+Date.now(),
      clienteId: this.clienteId,
      veiculoId: this.veiculoId,
      dataInicio: this.dataInicio,
      dataPrevista: this.dataPrevista,
      status: 'ativo'
    };
    this.storage.addRental(r);
    // reset
    this.clienteId=''; this.veiculoId=''; this.dataInicio=''; this.dataPrevista='';
    alert('Aluguel iniciado com sucesso.');
  }
}
