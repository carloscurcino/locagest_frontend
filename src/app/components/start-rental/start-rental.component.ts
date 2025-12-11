import { Component, OnInit, inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { Client } from '../../models/client.model';
import { LocacaoRequestDTO } from '../../models/locacao-request.dto';

@Component({
  selector: 'app-start-rental',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './start-rental.component.html',
  styleUrl: './start-rental.component.css'
})
export class StartRentalComponent implements OnInit {
  rentalForm!: FormGroup;
  vehicles: Vehicle[] = [];
  clients: Client[] = [];
  isLoadingVehicles = false;
  isLoadingClients = false;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  rentalValue: number | null = null;

  @Output() onSaved = new EventEmitter<void>();
  @Output() onCanceled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  ngOnInit(): void {
    this.rentalForm = this.fb.group({
      veiculoId: ['', Validators.required],
      clienteId: ['', Validators.required],
      dataHoraInicial: ['', Validators.required],
      dataHoraPrevistaDevolucao: ['', Validators.required],
      kmEntrega: ['', [Validators.required, Validators.min(0)]]
    });
    this.loadAvailableVehicles();
    this.loadClients();
  }

  loadAvailableVehicles() {
    this.isLoadingVehicles = true;
    this.http.get<Vehicle[]>(`${this.apiUrl}/veiculos/disponiveis`)
      .subscribe({
        next: (d) => { this.vehicles = d; this.isLoadingVehicles = false; },
        error: () => this.isLoadingVehicles = false
      });
  }

  loadClients() {
    this.isLoadingClients = true;
    this.http.get<Client[]>(`${this.apiUrl}/clientes`)
      .subscribe({
        next: (d) => { this.clients = d; this.isLoadingClients = false; },
        error: () => this.isLoadingClients = false
      });
  }

  onSubmit() {
    if (this.rentalForm.invalid) {
      this.rentalForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const formatDateTime = (d: any) => d && d.toString().length === 16 ? d.toString() + ':00' : d;
    const formData: LocacaoRequestDTO = {
      veiculoId: +this.rentalForm.value.veiculoId,
      clienteId: +this.rentalForm.value.clienteId,
      dataHoraInicial: formatDateTime(this.rentalForm.value.dataHoraInicial),
      dataHoraPrevistaDevolucao: formatDateTime(this.rentalForm.value.dataHoraPrevistaDevolucao),
      kmEntrega: +this.rentalForm.value.kmEntrega
    };

    this.http.post(`${this.apiUrl}/locacoes`, formData).subscribe({
      next: (response: any) => {
        this.rentalValue = response.valor || null;
        this.successMessage = this.rentalValue
          ? `Locação iniciada com sucesso! Valor parcial: R$ ${this.rentalValue.toFixed(2)}`
          : "Locação iniciada com sucesso!";
        this.isSubmitting = false;
        setTimeout(() => this.onSaved.emit(), 2000);
      },
      error: (e) => {
        this.errorMessage = "Erro ao salvar locação.";
        this.isSubmitting = false;
      }
    });
  }

  onCancel() { this.onCanceled.emit(); }
}
