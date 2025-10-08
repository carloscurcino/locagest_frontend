import { Injectable } from '@angular/core';
import { Vehicle, Client, Rental } from './models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key = 'sistema-aluguel-db-v1';
  private db: { vehicles: Vehicle[], clients: Client[], rentals: Rental[] } = { vehicles: [], clients: [], rentals: [] };

  constructor() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      try { this.db = JSON.parse(raw); } catch {}
    } else {
      // seed with some sample data
      this.db.vehicles = [{id:'V1', placa:'ABC1234', modelo:'Toyota Corolla', ano:2023, cor:'Prata', categoria:'Sedan'}];
      this.db.clients = [{id:'C1', nome:'João Silva', cpf:'000.000.000-00', telefone:'(11) 99999-0000', email:'joao@example.com'}];
      this.db.rentals = [{id:'R1', clienteId:'C1', veiculoId:'V1', dataInicio:'2025-09-15T09:00', dataPrevista:'2025-09-20T09:00', status:'ativo'}];
      this.save();
    }
  }

  private save(){ localStorage.setItem(this.key, JSON.stringify(this.db)); }

  getVehicles(){ return [...this.db.vehicles]; }
  addVehicle(v: Vehicle){ this.db.vehicles.push(v); this.save(); }
  getClients(){ return [...this.db.clients]; }
  addClient(c: Client){ this.db.clients.push(c); this.save(); }
  getRentals(){ return [...this.db.rentals]; }

  addRental(r: {
    id: string;
    clienteId: string;
    veiculoId: string;
    dataInicio: string;
    dataPrevista: string;
    status: string
  }){ this.db.rentals.push(r); this.save(); }
  updateRental(id: string, changes: Partial<Rental>){ const r = this.db.rentals.find(x=>x.id===id); if(r){ Object.assign(r,changes); this.save(); } }
}
