import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { Client } from './models';
@Component({
  selector: 'app-client-registration',
  template: `
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Cadastro de Clientes</h1>
    <form (ngSubmit)="save()" #f="ngForm" class="space-y-4 max-w-xl">
      <div>
        <label>Nome</label>
        <input name="nome" [(ngModel)]="client.nome" required class="block w-full border rounded p-2" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <input name="cpf" [(ngModel)]="client.cpf" class="block border rounded p-2" placeholder="CPF" />
        <input name="telefone" [(ngModel)]="client.telefone" class="block border rounded p-2" placeholder="Telefone" />
        <input name="email" [(ngModel)]="client.email" class="block border rounded p-2" placeholder="Email" />
      </div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
    </form>

    <h2 class="mt-6 text-xl">Clientes cadastrados</h2>
    <ul class="mt-2">
      <li *ngFor="let c of clients" class="p-2 border-b">
        {{c.nome}} — {{c.cpf}}
      </li>
    </ul>
  </div>
  `
})
export class ClientRegistrationComponent {
  client: Partial<Client> = {};
  clients: Client[] = [];
  constructor(private storage: StorageService){
    this.clients = storage.getClients();
  }
  save(){
    const c: Client = { id: 'C'+(Date.now()), nome: this.client.nome||'', cpf: this.client.cpf, telefone: this.client.telefone, email: this.client.email };
    this.storage.addClient(c);
    this.clients = this.storage.getClients();
    this.client = {};
  }
}
