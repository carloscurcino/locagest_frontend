import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="brand">
          <span class="brand-logo">L</span>
          <div class="brand-text">
            <div class="brand-name">LocaGest</div>
          </div>
        </div>

        <nav class="menu">
          <a routerLink="/rentals" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }" class="menu-item">
          <span class="icon" aria-hidden="true">
            <!-- grid icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>
            <span class="label">Gerenciar Aluguéis</span>
          </a>

          <a routerLink="/vehicles" routerLinkActive="active" class="menu-item">
          <span class="icon" aria-hidden="true">
            <!-- car icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm12 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
            <span class="label">Cadastro de Veículos</span>
          </a>

          <a routerLink="/clients" routerLinkActive="active" class="menu-item">
          <span class="icon" aria-hidden="true">
            <!-- users icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
            <span class="label">Cadastro de Clientes</span>
          </a>

          <a routerLink="/start" routerLinkActive="active" class="menu-item">
          <span class="icon" aria-hidden="true">
            <!-- play / start icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3v18l15-9L5 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
            <span class="label">Iniciar Aluguel</span>
          </a>

          <a routerLink="/end" routerLinkActive="active" class="menu-item">
          <span class="icon" aria-hidden="true">
            <!-- stop / finish icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>
            <span class="label">Encerrar Aluguel</span>
          </a>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="user">
          <div class="avatar">A</div>
          <div class="user-info">
            <div class="user-name">Admin</div>
            <div class="user-email">admin</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; }
    .sidebar {
      width: 260px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      border-right: 1px solid #e6e7eb;
      padding: 20px 16px;
      box-sizing: border-box;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background: #0f172a;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }
    .brand-name {
      font-weight: 700;
      color: #0f172a;
      font-size: 18px;
    }

    .menu { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 10px;
      border-radius: 8px;
      color: #0f172a;
      text-decoration: none;
      font-weight: 500;
      transition: background .12s, color .12s;
      position: relative;
    }
    .menu-item .icon { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; color: #374151; }
    .menu-item .label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .menu-item:hover {
      background: #f8fafc;
      color: #0b254a;
    }

    /* indicador à esquerda quando ativo */
    .menu-item.active::before {
      content: "";
      position: absolute;
      left: -8px;
      top: 6px;
      bottom: 6px;
      width: 4px;
      border-radius: 4px;
      background: #2563eb; /* azul */
    }
    .menu-item.active {
      color: #2563eb;
      background: rgba(37,99,235,0.06);
    }
    .menu-item.active .icon { color: #2563eb; }

    .sidebar-footer {
      padding-top: 12px;
      border-top: 1px solid #f1f2f4;
    }
    .user {
      display:flex;
      gap:12px;
      align-items:center;
      padding-top:12px;
    }
    .avatar {
      width:44px;
      height:44px;
      border-radius:999px;
      background:#0f172a;
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
    }
    .user-name { font-weight:600; color:#0f172a; }
    .user-email { font-size:12px; color:#6b7280; }
  `]
})
export class SidebarComponent {}
