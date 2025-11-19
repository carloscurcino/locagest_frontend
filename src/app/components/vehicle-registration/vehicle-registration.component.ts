import { Component, OnInit, inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-registration.component.html',
  styleUrl: './vehicle-registration.component.css'
})
export class VehicleRegistrationComponent implements OnInit {
  vehicleForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  @Output() onSaved = new EventEmitter<void>();
  @Output() onCanceled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/veiculos';

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1900)]],
      cor: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.http.post(this.apiUrl, this.vehicleForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.onSaved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao salvar veículo.';
        console.error(err);
      }
    });
  }

  onCancel() {
    this.onCanceled.emit();
  }
}
