import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'userSession';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Login fixo de exemplo (pode trocar por API)
    if (username === 'admin' && password === '1234') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ username }));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}
