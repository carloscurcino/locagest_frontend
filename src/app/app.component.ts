import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
  <div class="flex min-h-screen">
    <app-sidebar *ngIf="!isLoginPage"></app-sidebar>

    <div class="flex-1 p-4 bg-gray-50">
      <router-outlet></router-outlet>
    </div>
  </div>
  `
})
export class AppComponent {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.isLoginPage = url.startsWith('/login') || url.startsWith('/register');
      });
  }
}
