import { Component, OnInit, inject, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { Client } from '../../models/client.model';
import { LocacaoRequestDTO } from '../../models/locacao-request.dto';

@Component({
  selector: 'app-finish-rental',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './finish-rental.component.html',
  styleUrls: ['./finish-rental.component.css']
})
export class FinishRentalComponent implements OnInit {
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
  @Input() rentalId?: number;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  ngOnInit(): void {
    // Define data/hora atual para devolução
    const now = new Date();
    const currentDateTime = this.toDateTimeLocal(now.toISOString());

    this.rentalForm = this.fb.group({
      veiculoId: ['', Validators.required],
      clienteId: ['', Validators.required],
      dataHoraInicial: ['', Validators.required],
      dataHoraPrevistaDevolucao: ['', Validators.required],
      dataHoraDevolucao: [currentDateTime, Validators.required],
      kmEntrega: ['', [Validators.required, Validators.min(0)]]
    });
    // Desabilita os selects por padrão — os dados já devem estar preenchidos para finalização
    this.rentalForm.get('veiculoId')?.disable();
    this.rentalForm.get('clienteId')?.disable();
    // Desabilita a data de início — somente leitura ao finalizar
    this.rentalForm.get('dataHoraInicial')?.disable();
    this.loadAvailableVehicles();
    this.loadClients();
    // if rentalId is provided, load details for finishing; otherwise try to load fallback id 3
    const idToLoad = this.rentalId ?? 3;
    if (idToLoad) this.loadRentalDetails(idToLoad);
  }

  toDateTimeLocal(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  loadRentalDetails(rentalId: number) {
    this.http.get<any>(`${this.apiUrl}/locacoes/${rentalId}`)
      .subscribe({
        next: (data) => {
          const veiculoId = data.veiculoId ?? data.veiculo?.id ?? '';
          const clienteId = data.clienteId ?? data.cliente?.id ?? '';
          const dataInicial = data.dataHoraInicial ?? data.dataInicial ?? data.dataHoraInicial;
          const dataPrev = data.dataHoraPrevistaDevolucao ?? data.dataDevolucao ?? data.dataHoraPrevistaDevolucao;
          const kmEntrega = data.kmEntrega ?? data.km ?? 0;

          this.rentalForm.patchValue({
            veiculoId,
            clienteId,
            dataHoraInicial: this.toDateTimeLocal(dataInicial),
            dataHoraPrevistaDevolucao: this.toDateTimeLocal(dataPrev),
            kmEntrega
          });
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message || 'Erro ao carregar detalhes da locação.';
        }
      });
  }

  // Finaliza a locação existente (encerrar)
  finishRental() {
    if (!this.rentalId && !this.rentalForm.value) {
      this.errorMessage = 'ID da locação não fornecido.';
      return;
    }
    const id = this.rentalId ?? this.rentalForm.value.id;
    if (!id) {
      this.errorMessage = 'ID da locação inválido.';
      return;
    }
    if (this.rentalForm.invalid) {
      this.rentalForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const kmEntrega = +this.rentalForm.value.kmEntrega;
    const dataHoraDevolucao = this.rentalForm.value.dataHoraDevolucao;
    const formatDateTime = (d: any) => {
      if (!d) return null;
      // Se for string no formato yyyy-MM-ddTHH:mm, adiciona :00 para segundos
      if (typeof d === 'string' && d.length === 16) {
        d = d + ':00';
      }
      const date = new Date(d);
      return date.toISOString();
    };

    this.http.put(`${this.apiUrl}/locacoes/${id}/end`, {
      kmEntrega,
      dataDevolucao: formatDateTime(dataHoraDevolucao)
    }).subscribe({
      next: (response: any) => {
        this.rentalValue = response.valor || null;
        this.successMessage = this.rentalValue
          ? `Locação encerrada com sucesso! Valor final: R$ ${this.rentalValue.toFixed(2)}`
          : 'Locação encerrada com sucesso.';
        this.isSubmitting = false;
        setTimeout(() => this.onSaved.emit(), 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao encerrar locação', err);
        this.errorMessage = 'Erro ao encerrar locação.';
        this.isSubmitting = false;
      }
    });
  }

  loadAvailableVehicles() {
    this.isLoadingVehicles = true;
    this.http.get<Vehicle[]>(`${this.apiUrl}/veiculos`)
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
    this.finishRental();
  }

  onCancel() { this.onCanceled.emit(); }
}
