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
    this.router.navigate(['/login']);
  }

  register(name: string, cpf: string, email: string, password: string) {
    const body = { nome: name, cpf, email, senha:password };
    const data = this.http.post<any>('/auth/register', body);
    return data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}
