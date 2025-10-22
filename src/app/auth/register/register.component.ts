import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  cpf = '';
  email = '';
  password = '';
  errorMessage = '';
  errors: Record<string,string> = {};
  generalErrors: string[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.errors = {};
    this.generalErrors = [];

    this.auth.register(this.name, this.cpf, this.email, this.password).subscribe({
      next: (response) => {
        if (response) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Erro ao se registrar';
        }
      },
      error: (error) => {
        try {
          const body = error && error.error ? error.error : null;
          if (body && typeof body === 'object') {
            Object.keys(body).forEach((k) => {
              const v = body[k];
              if (Array.isArray(v)) {
                this.errors[k] = v.join(', ');
              } else if (typeof v === 'string') {
                this.errors[k] = v;
              } else if (v && typeof v === 'object') {
                this.errors[k] = JSON.stringify(v);
              }
            });
            if ((body as any).message && typeof (body as any).message === 'string') {
              this.generalErrors.push((body as any).message);
            }
          } else if (typeof error === 'string') {
            this.generalErrors.push(error);
          } else {
            this.generalErrors.push('Erro ao se registrar');
          }
        } catch (e) {
          this.generalErrors.push('Erro ao se registrar');
        }
      }
    });
  }
}
