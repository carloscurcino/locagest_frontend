import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importante para os links funcionarem
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule], // Adicionado para habilitar routerLink, routerLinkActive e mat-icon
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm12 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="label">Veículos</span>
          </a>

          <a routerLink="/clients" routerLinkActive="active" class="menu-item">
            <span class="icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="label">Clientes</span>
          </a>

        </nav>
      </div>

      <div class="sidebar-footer flex flex-col">
        <div class="user">
            <div class="avatar">{{ avatarLetter }}</div>
          <div class="user-info">
              <div class="user-name">{{ userName }}</div>
              <div class="user-email">{{ userEmail }}</div>
          </div>
        </div>
        <div class="logout">
          <a (click)="logout()" class="menu-item">
            <mat-icon aria-hidden="false" aria-label="Logout icon" fontIcon="logout"></mat-icon>
          </a>
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
      /* Fixar na esquerda se necessário */
      position: fixed;
      left: 0;
      top: 0;
      z-index: 50;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding-left: 8px; /* Pequeno ajuste */
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
      color: #64748b; /* Cor neutra para inativo */
      text-decoration: none;
      font-weight: 500;
      transition: background .12s, color .12s;
      position: relative;
    }

    .menu-item .icon {
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: currentColor; /* Herda cor do pai */
    }

    .menu-item .label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .menu-item:hover {
      background: #f8fafc;
      color: #0f172a;
    }

    /* Estado Ativo */
    .menu-item.active {
      color: #2563eb;
      background: rgba(37,99,235,0.08);
    }

    /* Indicador lateral azul */
    .menu-item.active::before {
      content: "";
      position: absolute;
      left: -8px;
      top: 8px;
      bottom: 8px;
      width: 4px;
      border-radius: 0 4px 4px 0;
      background: #2563eb;
    }

    .sidebar-footer {
      padding-top: 12px;
      border-top: 1px solid #f1f2f4;
    }
    .user {
      display:flex;
      gap:12px;
      align-items:center;
      padding: 8px;
      border-radius: 8px;
    }
    .user:hover {
        background: #f8fafc;
    }
    .avatar {
      width:40px;
      height:40px;
      border-radius:999px;
      background:#0f172a;
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size: 14px;
    }
    .user-name { font-weight:600; color:#0f172a; font-size: 14px; }
    .user-email { font-size:12px; color:#6b7280; }
  `]
})

export class SidebarComponent implements OnInit {
  userName = 'Usuário';
  userEmail = 'usuario@locagest.com';
  avatarLetter = 'U';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.userName = user.nome || user.name || user.username || this.userName;
      this.userEmail = user.email || this.userEmail;
      const first = this.userName.trim().charAt(0) || this.userEmail.trim().charAt(0);
      this.avatarLetter = first ? first.toUpperCase() : this.avatarLetter;
    }
  }

  logout() {
    this.auth.logout();
  }
}

