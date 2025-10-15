import { Injectable } from '@angular/core';
import { Vehicle, Client, Rental } from './models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key = 'sistema-aluguel-db-v1';
  private db: { vehicles: Vehicle[]; clients: Client[]; rentals: Rental[] } = { vehicles: [], clients: [], rentals: [] };

  constructor() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      try {
        this.db = JSON.parse(raw);
      } catch (e) {
        console.warn('Erro ao parsear storage, recriando DB seed', e);
        this.seed();
        this.save();
      }
    } else {
      this.seed();
      this.save();
    }
  }

  // --- helpers ---
  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.db));
  }

  private seed() {
    // seeds de exemplo — adapte para o seu ambiente
    this.db.vehicles = [
      {
        id: 'V1',
        placa: 'ABC-1234',
        modelo: 'Honda CG 160',
        kmAtual: 12000,
        status: 'disponivel'
      } as Vehicle,
      {
        id: 'V2',
        placa: 'XYZ-9876',
        modelo: 'Yamaha NMAX',
        kmAtual: 8000,
        status: 'disponivel'
      } as Vehicle
    ];

    this.db.clients = [
      {
        id: 'C1',
        nome: 'João Silva',
        cpf: '000.000.000-00',
        telefone: '(11) 99999-0000',
        email: 'joao@example.com',
        cnhNumero: '123456789',
        cnhValidade: '2026-05-01T00:00:00.000Z'
      } as Client,
      {
        id: 'C2',
        nome: 'Maria Souza',
        cpf: '111.222.333-44',
        telefone: '(11) 98888-0000',
        email: 'maria@example.com',
        cnhNumero: '987654321',
        cnhValidade: '2023-03-01T00:00:00.000Z' // vencida (exemplo)
      } as Client
    ];

    this.db.rentals = [
      {
        id: 'R1',
        clienteId: 'C1',
        veiculoId: 'V1',
        dataInicio: '2025-09-15T09:00:00.000Z',
        dataPrevista: '2025-09-20T09:00:00.000Z',
        kmEntrega: 12000,
        status: 'finalizado',
        criadoEm: new Date().toISOString()
      } as Rental
    ];
  }

  private nextId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  }

  // --- Vehicles ---
  getVehicles(): Vehicle[] {
    return JSON.parse(JSON.stringify(this.db.vehicles));
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.db.vehicles.find(v => v.id === id);
  }

  addVehicle(v: Vehicle) {
    if (!v.id) v.id = this.nextId('V');
    this.db.vehicles.push(v);
    this.save();
  }

  updateVehicle(updated: Partial<Vehicle> & { id: string }) {
    const idx = this.db.vehicles.findIndex(v => v.id === updated.id);
    if (idx === -1) return;
    this.db.vehicles[idx] = { ...this.db.vehicles[idx], ...updated };
    this.save();
  }

  setVehicleStatus(id: string, status: Vehicle['status']) {
    const v = this.getVehicleById(id);
    if (!v) return;
    v.status = status;
    this.updateVehicle(v);
  }

  // --- Clients ---
  getClients(): Client[] {
    return JSON.parse(JSON.stringify(this.db.clients));
  }

  getClientById(id: string): Client | undefined {
    return this.db.clients.find(c => c.id === id);
  }

  addClient(c: Client) {
    if (!c.id) c.id = this.nextId('C');
    this.db.clients.push(c);
    this.save();
  }

  updateClient(updated: Partial<Client> & { id: string }) {
    const idx = this.db.clients.findIndex(c => c.id === updated.id);
    if (idx === -1) return;
    this.db.clients[idx] = { ...this.db.clients[idx], ...updated };
    this.save();
  }

  // --- Rentals ---
  getRentals(): Rental[] {
    return JSON.parse(JSON.stringify(this.db.rentals));
  }

  addRental(r: Partial<Rental> & { clienteId: string; veiculoId: string; dataInicio: string; dataPrevista: string }) {
    const rental: Rental = {
      id: r.id ?? this.nextId('R'),
      clienteId: r.clienteId,
      veiculoId: r.veiculoId,
      dataInicio: new Date(r.dataInicio).toISOString(),
      dataPrevista: new Date(r.dataPrevista).toISOString(),
      kmEntrega: (r.kmEntrega ?? null) as any,
      status: (r.status ?? 'ativo') as any,
      criadoEm: r.criadoEm ?? new Date().toISOString()
    } as Rental;

    this.db.rentals.push(rental);
    this.save();

    // opcional: marcar veículo como locado automaticamente aqui (se desejado)
    const vehicle = this.getVehicleById(rental.veiculoId);
    if (vehicle) {
      vehicle.status = 'locado';
      this.updateVehicle(vehicle);
    }

    return rental;
  }

  updateRental(id: string, changes: Partial<Rental>) {
    const r = this.db.rentals.find(x => x.id === id);
    if (!r) return;
    Object.assign(r, changes);
    this.save();
  }

  // --- util ---
  clearAll() {
    this.db = { vehicles: [], clients: [], rentals: [] };
    this.save();
  }
}
