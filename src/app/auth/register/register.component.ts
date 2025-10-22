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
  // errors por campo vindo do backend, ex: { senha: '...', cpf: '...' }
  errors: Record<string,string> = {};
  // mensagens gerais não atreladas a campos
  generalErrors: string[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    // reset errors
    this.errors = {};
    this.generalErrors = [];

    this.auth.register(this.name, this.cpf, this.email, this.password).subscribe({
      next: (response) => {
        // Ajuste conforme a resposta da sua API
        console.log("Respoinse", response)
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/rentals']);
        } else {
          this.errorMessage = 'Usuário ou senha incorretos';
        }
      },
      error: (error) => {
        try {
          // se error.error for o corpo já desserializado
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
