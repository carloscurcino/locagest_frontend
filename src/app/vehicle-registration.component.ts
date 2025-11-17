import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { Vehicle } from './models';
@Component({
  selector: 'app-vehicle-registration',
  template: `
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Cadastro de Veículos</h1>
    <form (ngSubmit)="save()" #f="ngForm" class="space-y-4 max-w-xl">
      <div>
        <label>Placa</label>
        <input name="placa" [(ngModel)]="vehicle.placa" required class="block w-full border rounded p-2" />
      </div>
      <div>
        <label>Modelo</label>
        <input name="modelo" [(ngModel)]="vehicle.modelo" required class="block w-full border rounded p-2" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <input name="ano" type="number" [(ngModel)]="vehicle.ano" class="block border rounded p-2" placeholder="Ano" />
        <input name="cor" [(ngModel)]="vehicle.cor" class="block border rounded p-2" placeholder="Cor" />
        <input name="categoria" [(ngModel)]="vehicle.categoria" class="block border rounded p-2" placeholder="Categoria" />
      </div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
    </form>

    <h2 class="mt-6 text-xl">Veículos cadastrados</h2>
    <ul class="mt-2">
      <li *ngFor="let v of vehicles" class="p-2 border-b">
        {{v.modelo}} — {{v.placa}} ({{v.ano}})
      </li>
    </ul>
  </div>
  `
})
export class VehicleRegistrationComponent {
  vehicle: Partial<Vehicle> = {};
  vehicles: Vehicle[] = [];
  constructor(private storage: StorageService){
    this.vehicles = storage.getVehicles();
  }
  save(){
    const v: Vehicle = { id: 'V'+(Date.now()), placa: this.vehicle.placa||'', modelo: this.vehicle.modelo||'', ano: this.vehicle.ano, cor: this.vehicle.cor, categoria: this.vehicle.categoria };
    this.storage.addVehicle(v);
    this.vehicles = this.storage.getVehicles();
    this.vehicle = {};
  }
}
