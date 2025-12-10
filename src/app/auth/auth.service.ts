import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'token';

  constructor(private router: Router, private http: HttpClient) {}

  login(identifier: string, password: string) {
    const body = { identifier, password };
    const data = this.http.post<any>('/auth/login', body);
    return data;
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  register(name: string, cpf: string, email: string, password: string) {
    const body = { nome: name, cpf, email, senha:password };
    const data = this.http.post<any>('/auth/register', body);
    return data;
  }

  getToken(): string | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    return raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
  }

  getUser(): any | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private decodeTokenPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(payload).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // Verifica se o token está expirado
  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const payload = this.decodeTokenPayload(t);
    if (!payload || !payload.exp) return true;
    const expMs = payload.exp * 1000;
    return Date.now() >= expMs;
  }

  // Verifica autenticação considerando expiração
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
}
