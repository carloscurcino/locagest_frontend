import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  identifier = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/rentals']);
    }
  }

  onSubmit() {
    this.auth.login(this.identifier, this.password).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/rentals']);
        } else {
          this.errorMessage = 'Usuário ou senha incorretos';
        }
      },
      error: (error) => {
        const body = error && error.error ? error.error : null;
        this.errorMessage = body.error || 'Erro ao tentar logar';
      }
    });
  }
}
