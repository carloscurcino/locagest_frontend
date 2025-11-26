import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { Vehicle } from './models';
@Component({
  selector: 'app-vehicle-registration',
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Cadastro de Veículos</h1>
      <form (ngSubmit)="save()" #f="ngForm" class="space-y-4 max-w-xl">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label>Placa</label>
            <input name="placa" [(ngModel)]="vehicle.placa" required class="block w-full border rounded p-2" placeholder="Ex: ABC-1234" />
          </div>
          <div>
            <label>Marca/Fabricante</label>
            <input name="fabricante" [(ngModel)]="vehicle.fabricante" required class="block w-full border rounded p-2" placeholder="Marca/Fabricante" />
          </div>
        </div>
        <div>
          <label>Modelo</label>
          <input name="modelo" [(ngModel)]="vehicle.modelo" required class="block w-full border rounded p-2" placeholder="Ex: Fiat Uno" />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label>Ano/Modelo</label>
            <input name="ano" type="number" [(ngModel)]="vehicle.ano" required class="block w-full border rounded p-2" placeholder="Ano/Modelo" />
          </div>
          <div>
            <label>Cor</label>
            <input name="cor" [(ngModel)]="vehicle.cor" required class="block w-full border rounded p-2" placeholder="Cor" />
          </div>
          <div>
            <label>Categoria</label>
            <input name="categoria" [(ngModel)]="vehicle.categoria" required class="block w-full border rounded p-2" placeholder="Categoria" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label>Renavam</label>
            <input name="renavam" type="number" [(ngModel)]="vehicle.renavam" required class="block w-full border rounded p-2" placeholder="Renavam" />
          </div>
          <div>
            <label>Chassi</label>
            <input name="chassi" [(ngModel)]="vehicle.chassi" required class="block w-full border rounded p-2" placeholder="Chassi" />
          </div>
        </div>
        <div>
          <label>Tipo de Combustível</label>
          <input name="combustivel" [(ngModel)]="vehicle.combustivel" required class="block w-full border rounded p-2" placeholder="Tipo de Combustível" />
        </div>

        <div>
          <label>KM Atual</label>
          <input name="kmAtual" type="number" [(ngModel)]="vehicle.kmAtual" required class="block w-full border rounded p-2" placeholder="KM" />
        </div>
        <button [disabled]="!f.valid" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Salvar Veículo</button>
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
  save() {
    const v: Vehicle = {
      id: 'V' + Date.now(),
      placa: this.vehicle.placa!,
      modelo: this.vehicle.modelo!,
      fabricante: this.vehicle.fabricante!,
      ano: this.vehicle.ano!,
      cor: this.vehicle.cor!,
      categoria: this.vehicle.categoria!,
      kmAtual: this.vehicle.kmAtual!,
      renavam: this.vehicle.renavam!,
      chassi: this.vehicle.chassi!,
      combustivel: this.vehicle.combustivel!,
      status: 'disponivel'
    };

    this.storage.addVehicle(v);
    this.vehicles = this.storage.getVehicles();
    this.vehicle = {};
  }
}
