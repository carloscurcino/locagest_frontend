import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import {Rental} from "./models";
@Component({
  selector: 'app-end-rental',
  template: `
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Encerrar Aluguel</h1>
    <div>
      <label>Aluguel</label>
      <select [(ngModel)]="rentalId" class="block w-full border rounded p-2">
        <option *ngFor="let r of rentals" [value]="r.id">{{r.id}} — {{getClientName(r.clienteId)}} — {{getVehiclePlate(r.veiculoId)}}</option>
      </select>
    </div>
    <div class="mt-4">
      <label>Data de fim</label>
      <input type="datetime-local" [(ngModel)]="dataFim" class="block w-full border rounded p-2" />
    </div>
    <div class="mt-4">
      <button (click)="end()" class="px-4 py-2 bg-red-600 text-white rounded">Encerrar</button>
    </div>
  </div>
  `
})
export class EndRentalComponent {
  rentals: Rental[] = [];
  rentalId = '';
  dataFim = '';
  constructor(private storage: StorageService){
    this.rentals = storage.getRentals().filter(r=>r.status==='ativo');
  }
  getClientName(id: string){ const c = this.storage.getClients().find(x=>x.id===id); return c?c.nome:'-'; }
  getVehiclePlate(id: string){ const v = this.storage.getVehicles().find(x=>x.id===id); return v?v.placa:'-'; }
  end(){
    if(!this.rentalId){ alert('Selecione um aluguel'); return; }
    this.storage.updateRental(this.rentalId, { dataFim: this.dataFim, status: 'finalizado' });
    alert('Aluguel encerrado.');
    this.rentals = this.storage.getRentals().filter(r=>r.status==='ativo');
    this.rentalId=''; this.dataFim='';
  }
}
