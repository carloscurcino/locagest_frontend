import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'token';

  constructor(private router: Router, private http: HttpClient) {}

  // Exemplo de login usando requisição HTTP POST
  login(email: string, password: string) {
    const body = { email, password };
    // Substitua a URL abaixo pela URL real da sua API de autenticação
    const data = this.http.post<any>('/auth/login', body);
    return data;
    // Exemplo de uso:
    // this.authService.login('admin', '1234').subscribe(response => {
    //   if (response.sucesso) {
    //     localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response.token));
    //   }
    // });
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}
