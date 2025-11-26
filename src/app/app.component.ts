import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="flex min-h-screen bg-gray-50 font-sans">

      <app-sidebar *ngIf="!isLoginPage"></app-sidebar>

      <main class="flex-1 p-8 transition-all duration-300"
            [ngClass]="{'ml-[260px]': !isLoginPage}">

        <router-outlet></router-outlet>

      </main>

    </div>
  `
})
export class AppComponent {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isLoginPage = url.startsWith('/login') || url.startsWith('/register');
      });
  }
}
