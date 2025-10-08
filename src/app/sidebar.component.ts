import { Component } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  template: `
  <nav class="sidebar">
    <h2>Sistema</h2>
    <ul>
      <li><a routerLink="/rentals">Gerenciar Aluguéis</a></li>
      <li><a routerLink="/vehicles">Cadastro de Veículos</a></li>
      <li><a routerLink="/clients">Cadastro de Clientes</a></li>
      <li><a routerLink="/start">Iniciar Aluguel</a></li>
      <li><a routerLink="/end">Encerrar Aluguel</a></li>
    </ul>
  </nav>
  `,
  styles: ['.sidebar{width:220px;padding:16px;background:#111827;color:white}.sidebar ul{list-style:none;padding:0}.sidebar a{color:inherit;text-decoration:none}']
})
export class SidebarComponent {}
