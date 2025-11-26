import { Component, OnInit, inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-registration.component.html',
  styleUrl: './client-registration.component.css'
})
export class ClientRegistrationComponent implements OnInit {
  clientForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  @Output() onSaved = new EventEmitter<void>();
  @Output() onCanceled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/clientes';

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.http.post(this.apiUrl, this.clientForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.onSaved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao salvar cliente. Verifique se o CPF já existe.';
        console.error(err);
      }
    });
  }

  onCancel() {
    this.onCanceled.emit();
  }
}
