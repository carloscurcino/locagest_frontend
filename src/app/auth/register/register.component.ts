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

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
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
      error: () => {
        this.errorMessage = 'Erro ao tentar logar';
      }
    });
  }
}
